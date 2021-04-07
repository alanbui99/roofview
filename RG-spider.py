import scrapy
from scrapy.crawler import CrawlerProcess

import json

class RG_spider(scrapy.Spider):
    name = 'rg_spider'

    def start_requests(self):
        url = 'https://www.therooftopguide.com/'
        yield scrapy.Request(url=url, callback=self.parse_home)

    def parse_home(self, response):
        continent_urls = response.css('.continents-wrapper > .continent-box').xpath('./a/@href').extract()
        
        for url in continent_urls:
            yield response.follow(url=url, callback=self.parse_continent)

    def parse_continent(self, response):
        city_urls = response.css('#wrapper_continent .wrapper-continent-link-box').xpath('./a/@href').extract()

        for url in city_urls:
            yield response.follow(url=url, callback=self.parse_list)
    
    def parse_list(self, response):
        item_urls = response.css('.headline-inner-wrap').xpath('./a/@href').extract()
        names = response.css('.headline-wrap > .headline-inner-wrap h2.bar-name::text').extract()
        descs = response.css('figure div.text > p').extract()

        for i, url in enumerate(item_urls):
            yield response.follow(url=url, callback=self.parse_item, meta={'name': names[i], 'desc': descs[i]})
    
    def parse_item(self, response):
        item = {
            'name': response.meta.get('name'),
            'desc': response.meta.get('desc'),
            'city': response.css('#bar_column > h2 > span::text').extract_first().split('in ')[-1],
            'height': response.css('#bar_column > div.last-update-price > div.floor::text').extract_first(),
            'features': response.css('ul.in-short > li::text').extract(),
            # 'description': [p.replace('\n', '').strip() for p in response.css('#disp-Info > p::text').extract() ],
            'view': response.css('.view_box > .info::text').extract_first(),
            'food': response.css('.food_box > .info::text').extract_first()
        }

        rooftops.append(item)

rooftops = []

process = CrawlerProcess()
process.crawl(RG_spider)
process.start()


with open('data.json', 'w') as outfile:
    json.dump(rooftops, outfile)

