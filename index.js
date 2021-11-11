import express from 'express'
import path from 'path'
import fetch from 'node-fetch'

const app = express()
const port = process.env.PORT || "8000"

const slug = "ethereum"
const url = "https://api.santiment.net/graphql"

const query = (address) => JSON.stringify({query: `
  {
    blockchainAddress(selector: {address: "${address}", infrastructure: "ETH"}) {
      balance(selector: {slug: "ethereum"})
  }
}
`})

app.get("/:address", async (req, res) => {
  const address = req.params.address 
  const response = await fetch(
    url,
    {
      method: 'post',
      body: query(address),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node',
      },
    }
  )
  const json = await response.json()
  const balance = json.data?.blockchainAddress?.balance
  res.status(200).send(`${address}: ${balance} ETH`)
})

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`)
})
