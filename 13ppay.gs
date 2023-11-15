// 画像の文字を解析して出力するコード
// 使用API
// ライブラリ+から
// ImgApp（1T03nYHRho6XMWYcaumClcWr6ble65mAT8OLJqRFJ5lukPVogAN2NDl-y）
// サービス+から
// Drive
// Slides
function myFunction() {

  // 画像URLのレスポンス取得
  var response = UrlFetchApp.fetch("https://drrrkari.com/upimg/5aca6a9dc5e18fbf491baf39fa7cdfaa.jpeg",{method:"get"});

  // 画像情報を取得
  var blob = response.getBlob();

  // 画像をトリミング
  const blob2 = ImgApp.editImage({
    blob: blob,
    unit: "pixel",
    crop: { t: 115, b: 160 , l: 160, r: 95}
  });

  // Googleドライブのフォルダに保存
  // 1DqcHnXl5LSbcYC7pFukEDqslVFL-Ih5L
  var newFile = DriveApp.getFolderById("1DqcHnXl5LSbcYC7pFukEDqslVFL-Ih5L").createFile(blob2); 
  
  // 画像から文字を解析するコード（Googleドライブの画像を使用）
  let imageData = Drive.Files.copy({title: "OCR_TEST"}, newFile.getId(), {"ocr": true, "ocrLanguage": "jp"});
  let ocrData = DocumentApp.openById(imageData.id).getBody().getText();

  // 画像の文字を出力
  console.log(ocrData);
}
