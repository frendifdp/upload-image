const express 	  = require('express');
const app		      = express();
const multer = require('multer')
const storage = multer.memoryStorage();

app.get('/', (req, res) => {
	res.send({message: "ook"})
})

app.post('/upload', (req, res, next) => {
	const upload = multer({ storage }).single('path')
	upload(req, res, function(err) {
	  if (err) {
		return res.send(err)
	  }
	  console.log('file uploaded to server')
	  console.log(req.file)
  
	  // SEND FILE TO CLOUDINARY
	  const cloudinary = require('cloudinary').v2
	  cloudinary.config({
		cloud_name: 'clonecarousell',
		api_key: '495172599284796',
		api_secret: 't7QPu3LkoS4YJpQGB2ERYQM9zqo'
	  })
	  
	  const path = req.file.path
	  const uniqueFilename = new Date().toISOString()
  
	  cloudinary.uploader.upload(
		path,
		{ public_id: `samples/${uniqueFilename}`}, // directory and tags are optional
		function(err, image) {
		  if (err) return res.send(err)
		  console.log('file uploaded to Cloudinary')
		  // remove file from server
		  const fs = require('fs')
		  fs.unlinkSync(path)
		  // return image details
		  res.json(image)
		}
	  )
	})
  })
  app.listen(5000);
