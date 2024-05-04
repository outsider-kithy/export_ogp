var express = require('express');
var router = express.Router();

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {
    title: "OGP画像のエクスポート",
    content: "タイトルを入力してください。"
  }
  res.render('index', data);
});

router.post('/', function(req, res, next){
  let title = req.body.title;
  let date = Date.now().toString();
  
  //OGP画像を生成
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  //ogp_template.jpgを読み込む
  loadImage('public/images/ogp/ogp_template.jpg').then((image) => {
      ctx.drawImage(image, 0, 0, 1200, 630);
      let fontSize = 60;
      ctx.font = `bold ${fontSize}px 'Arial'`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";

      //画像の中央にtitleを描画
      //h1の先頭から32文字までを取得
      let titleText = title.slice(0,31);
      //titleが32文字以上の場合は...を付ける
      if(title.length > 32){
          titleText += "...";
      }
      if(titleText.length > 16){
          ctx.fillText(titleText.slice(0,16), canvas.width / 2, canvas.height / 2 - (fontSize * 0.75));
          ctx.fillText(titleText.slice(16), canvas.width / 2, canvas.height / 2 + (fontSize * 0.75));
      }else{
          ctx.fillText(titleText, canvas.width / 2, canvas.height / 2);
      }
    
      // PNG形式で保存
      const out = fs.createWriteStream(`public/images/ogp/ogp_${date}.jpg`);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
    });
  res.redirect('/');
});

module.exports = router;
