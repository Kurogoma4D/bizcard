// 参考: https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8

varying vec2 vUv;

void main()
{
  // 変換：ローカル座標 → 配置 → カメラ座標
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);    
  // 変換：カメラ座標 → 画面座標
  gl_Position = projectionMatrix * mvPosition;
  vUv = uv;
}