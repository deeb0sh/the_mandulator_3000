import express from 'express'
import cors from 'cors'
import fetch, { Headers } from 'node-fetch'
import tunnel from 'tunnel'
import cookieParser from 'cookie-parser';

const app = express()
const port = 3000

app.use(express.json());
app.use(cors());
//app.use(cookieParser());

const proxyOptions = {
  host: '10.4.0.3',
  port: 3128
}

const tunnelAgent = tunnel.httpsOverHttp({
  proxy: proxyOptions
})

app.post('/api/proxy', async (req,res) => {
  const url = req.body.PostURL

  const userHeaders = req.headers;
  //const userCookies = req.cookies;
  
  const response = await fetch(url, {
    agent: tunnelAgent,
    headers: {
      userHeaders,
    }
  })
  const headers = response.headers;
  const html = await response.text()
  //res.json({ html })
  res.send(html)
})

app.get('/api', (req, res) => {
  res.type('html'),
  res.send('<b>Hello World!</b>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})