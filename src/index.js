import express from 'express'
import QRCode from 'qrcode'

const app = express()
const PORT = 4201


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }

  next()
})

app.get('/generate', async (req, res) => {
  const { link, color1, color2, width, margin, pattern } = req.query

  try {
    // Generate QR code as a PNG image
    const qrCodeImage = await QRCode.toBuffer(link, {
      type: 'png',
      color: {
        dark: color1 || '#000671ff',
        light: color2 || '#fffce5'
      },
      margin: margin || 2,
      width: width || 1000,
      rendererOpts: {
        deflateLevel: 0,
      },
      maskPattern: pattern || 5,
    });

    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'attachment; filename="qr-code.png"');

    res.send(qrCodeImage);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating QR code');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening ${PORT} port`)
})
