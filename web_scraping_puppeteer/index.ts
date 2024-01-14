// console.log("hello")
import { Browser } from 'puppeteer'

const puppeteer = require('puppeteer')
// write to file
const fs = require('fs')

const url = 'https://books.toscrape.com'
// test to get screenshoot
const url2 = 'https://bot.sannysoft.com/'

const main = async () => {
    // headless: true , now browser openned
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url2)
    await page.screenshot({ path: 'bot.jpg' })

    await page.goto(url)

    const bookData = await page.evaluate((url: any) => {
        // remove currency symbol
        const convertPrice = (price: string) => {
            return parseFloat(price.replace('£', ''))
        }

        // convert rating to number 
        const convertRating = (rating: string) => {
            switch (rating) {
                case 'One':
                    return 1
                case 'Two':
                    return 2
                case 'Three':
                    return 3
                case 'Four':
                    return 4
                case 'Five':
                    return 5
                default:
                    return 0
            }
        }

        // look on webpage source tag 
        // <article class="productt_pod"> ...</article>
        const bookPods = Array.from(document.querySelectorAll('.product_pod'))
        const data = bookPods.map((book: any) => ({
            title: book.querySelector('h3 a').getAttribute('title'),
            price: convertPrice(book.querySelector('.price_color').innerText),
            imgSrc: url + book.querySelector('img').getAttribute('src'),
            rating: convertRating(book.querySelector('.star-rating').classList[1]),
        }))
        return data
    }, url)

    console.log(bookData)

    await browser.close()

    fs.writeFile('data.json', JSON.stringify(bookData), (err: any) => {
        if (err) throw err
        console.log('saved json')
    })

}

main()

