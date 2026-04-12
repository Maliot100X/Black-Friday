#!/usr/bin/env python3
"""
MK BLACK FRIDAY RADAR - Deal Scraper System
Uses Scrapy and Playwright for multi-site deal extraction
"""

import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.exceptions import DropItem
from playwright.sync_api import sync_playwright
from datetime import datetime
import json
import re
from typing import List, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DealItem(scrapy.Item):
    """Structured deal data"""
    title = scrapy.Field()
    product_name = scrapy.Field()
    original_price = scrapy.Field()
    discounted_price = scrapy.Field()
    discount_percentage = scrapy.Field()
    currency = scrapy.Field()
    store = scrapy.Field()
    category = scrapy.Field()
    image_url = scrapy.Field()
    product_url = scrapy.Field()
    description = scrapy.Field()
    location = scrapy.Field()
    scraped_at = scrapy.Field()
    source = scrapy.Field()


class AmazonSpider(scrapy.Spider):
    """Spider for Amazon deals"""
    name = "amazon"
    allowed_domains = ["amazon.com"]

    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 2,
        'CONCURRENT_REQUESTS': 2,
    }

    def __init__(self, category="electronics", **kwargs):
        self.category = category
        self.start_urls = [f"https://www.amazon.com/s?k={category}+deals"]
        super().__init__(**kwargs)

    def parse(self, response):
        """Parse Amazon search results"""
        products = response.css('div[data-component-type="s-search-result"]')

        for product in products:
            try:
                item = DealItem()
                item['source'] = 'amazon'
                item['store'] = 'Amazon'
                item['category'] = self.category
                item['scraped_at'] = datetime.now().isoformat()

                # Extract title
                title = product.css('h2 a span::text').get()
                item['title'] = title.strip() if title else None
                item['product_name'] = item['title']

                # Extract prices
                price_whole = product.css('span.a-price-whole::text').get()
                price_fraction = product.css('span.a-price-fraction::text').get()

                if price_whole:
                    discounted = price_whole.replace(',', '')
                    if price_fraction:
                        discounted += '.' + price_fraction
                    item['discounted_price'] = float(discounted)

                # Original price (crossed out)
                original = product.css('span.a-text-price span::text').get()
                if original:
                    item['original_price'] = float(original.replace('$', '').replace(',', ''))
                    if item.get('discounted_price') and item.get('original_price'):
                        discount = ((item['original_price'] - item['discounted_price']) / item['original_price']) * 100
                        item['discount_percentage'] = round(discount, 2)

                item['currency'] = 'USD'
                item['product_url'] = response.urljoin(product.css('h2 a::attr(href)').get(''))
                item['image_url'] = product.css('img::attr(src)').get('')

                if item.get('title') and item.get('discounted_price'):
                    yield item

            except Exception as e:
                logger.error(f"Error parsing Amazon product: {e}")

        # Follow pagination
        next_page = response.css('a.s-pagination-next::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)


class GenericDealSpider(scrapy.Spider):
    """Generic spider for local Skopje stores"""
    name = "local_skopje"

    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'ROBOTSTXT_OBEY': True,
        'DOWNLOAD_DELAY': 1,
    }

    # Local Skopje stores - sample URLs (would be configured per store)
    store_configs = {
        'technomarket': {
            'url': 'https://www.technomarket.mk/promocii',
            'name': 'TechnoMarket Skopje',
            'selectors': {
                'product': '.product-item',
                'title': '.product-title',
                'price': '.price',
                'old_price': '.old-price',
                'image': '.product-image img::attr(src)'
            }
        },
        'anhoch': {
            'url': 'https://www.anhoch.mk/akcii',
            'name': 'Anhoch Skopje',
            'selectors': {
                'product': '.product',
                'title': '.product-name',
                'price': '.current-price',
                'old_price': '.original-price',
                'image': '.product-image::attr(src)'
            }
        },
        'neptun': {
            'url': 'https://www.neptun.mk/promotions',
            'name': 'Neptun Skopje',
            'selectors': {
                'product': '.promo-item',
                'title': '.item-title',
                'price': '.promo-price',
                'old_price': '.regular-price',
                'image': '.item-image::attr(src)'
            }
        }
    }

    def __init__(self, store=None, **kwargs):
        if store and store in self.store_configs:
            self.store_key = store
            self.start_urls = [self.store_configs[store]['url']]
        else:
            # Scrape all configured stores
            self.start_urls = [cfg['url'] for cfg in self.store_configs.values()]
        super().__init__(**kwargs)

    def parse(self, response):
        """Parse local store deals"""
        # Detect which store we're scraping
        store_key = self._detect_store(response.url)
        config = self.store_configs.get(store_key, {})
        selectors = config.get('selectors', {})

        products = response.css(selectors.get('product', '.product'))

        for product in products:
            try:
                item = DealItem()
                item['source'] = store_key or 'local_store'
                item['store'] = config.get('name', 'Local Store')
                item['category'] = 'Electronics'
                item['scraped_at'] = datetime.now().isoformat()
                item['location'] = 'Skopje, North Macedonia'
                item['currency'] = 'MKD'

                # Extract data using store-specific selectors
                item['title'] = product.css(selectors.get('title', '.title') + '::text').get('').strip()
                item['product_name'] = item['title']

                # Price extraction
                price_text = product.css(selectors.get('price', '.price') + '::text').get('')
                item['discounted_price'] = self._parse_price(price_text)

                old_price_text = product.css(selectors.get('old_price', '.old-price') + '::text').get('')
                if old_price_text:
                    item['original_price'] = self._parse_price(old_price_text)
                    if item.get('original_price') and item.get('discounted_price'):
                        discount = ((item['original_price'] - item['discounted_price']) / item['original_price']) * 100
                        item['discount_percentage'] = round(discount, 2)

                item['image_url'] = product.css(selectors.get('image', 'img::attr(src)')).get('')
                item['product_url'] = response.urljoin(product.css('a::attr(href)').get(''))

                if item.get('title') and item.get('discounted_price'):
                    yield item

            except Exception as e:
                logger.error(f"Error parsing local store product: {e}")

    def _detect_store(self, url: str) -> str:
        """Detect which store based on URL"""
        for key, config in self.store_configs.items():
            if key in url:
                return key
        return None

    def _parse_price(self, price_text: str) -> float:
        """Extract numeric price from text"""
        if not price_text:
            return 0.0
        # Remove currency symbols and whitespace
        cleaned = re.sub(r'[^\d.,]', '', price_text)
        # Handle different decimal separators
        cleaned = cleaned.replace(',', '.')
        try:
            return float(cleaned)
        except ValueError:
            return 0.0


class PlaywrightScraper:
    """JavaScript-rendered site scraper using Playwright"""

    def __init__(self):
        self.results = []

    def scrape_with_js(self, url: str, wait_for: str = None, timeout: int = 30000) -> List[Dict]:
        """Scrape JavaScript-rendered page"""
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            try:
                page.goto(url, wait_until='networkidle', timeout=timeout)

                # Wait for specific element if specified
                if wait_for:
                    page.wait_for_selector(wait_for, timeout=10000)

                # Scroll to load lazy content
                self._scroll_page(page)

                # Extract deals
                deals = page.evaluate("""() => {
                    const items = document.querySelectorAll('[data-product], .product, .deal-item');
                    return Array.from(items).map(item => ({
                        title: item.querySelector('.title, .name, h2')?.textContent?.trim() || '',
                        price: item.querySelector('.price, .current-price')?.textContent?.trim() || '',
                        originalPrice: item.querySelector('.old-price, .original')?.textContent?.trim() || '',
                        image: item.querySelector('img')?.src || '',
                        link: item.querySelector('a')?.href || ''
                    }));
                }""")

                self.results = [d for d in deals if d.get('title') and d.get('price')]

            except Exception as e:
                logger.error(f"Playwright scraping error: {e}")
            finally:
                browser.close()

        return self.results

    def _scroll_page(self, page, scroll_count: int = 3):
        """Scroll page to load lazy content"""
        for _ in range(scroll_count):
            page.evaluate('window.scrollBy(0, window.innerHeight)')
            page.wait_for_timeout(1000)


class DealScraperPipeline:
    """Process and store scraped deals"""

    def __init__(self, db_url: str = None):
        self.db_url = db_url or "postgresql:///?dbname=mkbf_deals&user=postgres"
        self.deals = []

    def process_item(self, item: DealItem, spider):
        """Process a scraped deal"""
        # Validate required fields
        if not item.get('title') or not item.get('discounted_price'):
            raise DropItem("Missing required fields")

        # Clean and normalize data
        deal_dict = dict(item)
        deal_dict['scraped_at'] = datetime.now().isoformat()

        # Calculate discount if not present
        if not deal_dict.get('discount_percentage') and deal_dict.get('original_price'):
            try:
                orig = float(deal_dict['original_price'])
                disc = float(deal_dict['discounted_price'])
                deal_dict['discount_percentage'] = round(((orig - disc) / orig) * 100, 2)
            except:
                deal_dict['discount_percentage'] = 0

        self.deals.append(deal_dict)
        logger.info(f"Processed deal: {deal_dict['title'][:50]}...")

        return deal_dict

    def save_to_database(self):
        """Save all deals to PostgreSQL"""
        try:
            import psycopg2
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()

            for deal in self.deals:
                cursor.execute("""
                    INSERT INTO deals (
                        title, description, original_price, discount_price,
                        discount_percentage, category, product_url, image_url,
                        is_active, store_id
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT DO NOTHING
                """, (
                    deal.get('title'),
                    deal.get('description', ''),
                    deal.get('original_price', 0),
                    deal.get('discounted_price', 0),
                    deal.get('discount_percentage', 0),
                    deal.get('category', 'General'),
                    deal.get('product_url', ''),
                    deal.get('image_url', ''),
                    True,
                    1  # Default store_id, should be mapped
                ))

            conn.commit()
            cursor.close()
            conn.close()
            logger.info(f"Saved {len(self.deals)} deals to database")

        except Exception as e:
            logger.error(f"Database save error: {e}")

    def save_to_json(self, filename: str = "scraped_deals.json"):
        """Save deals to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.deals, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved {len(self.deals)} deals to {filename}")


def run_scrapers():
    """Run all scrapers"""
    logger.info("=== Starting Deal Scrapers ===")

    # Configure Scrapy process
    process = CrawlerProcess(settings={
        'ITEM_PIPELINES': {'__main__.DealScraperPipeline': 300},
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 2,
    })

    # Add spiders
    # Note: Actual crawling disabled in demo mode to avoid hitting real sites
    # process.crawl(AmazonSpider, category="electronics")
    # process.crawl(GenericDealSpider, store="technomarket")

    # Run Playwright scraper for JS sites
    pw_scraper = PlaywrightScraper()

    logger.info("Scrapers configured (demo mode - not hitting real sites)")

    # process.start()  # Start crawling (disabled in demo)

    logger.info("=== Scrapers Complete ===")


if __name__ == "__main__":
    run_scrapers()
