/**
 * Created by shengqiang.wu on 2018/2/24/024.
 */
function downloadExl(json, type, elementId) {
	var tmpDown; //导出的二进制对象
	var tmpdata = json[0];
	json.unshift({});
	var keyMap = []; //获取keys
	//keyMap =Object.keys(json[0]);
	for (var k in tmpdata) {
		keyMap.push(k);
		json[0][k] = k;
	}
	var tmpdata = []; //用来保存转换好的json
	json
		.map((v, i) =>
			keyMap.map((k, j) =>
				Object.assign(
					{},
					{
						v: v[k],
						position:
							(j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1),
					}
				)
			)
		)
		.reduce((prev, next) => prev.concat(next))
		.forEach(
			(v, i) =>
				(tmpdata[v.position] = {
					v: v.v,
				})
		);
	var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
	var tmpWB = {
		SheetNames: ["Sheet1"], //保存的表标题
		Sheets: {
			Sheet1: Object.assign(
				{},
				tmpdata, //内容
				{
					"!ref": outputPos[0] + ":" + outputPos[outputPos.length - 1], //设置填充区域
				}
			),
		},
	};
	tmpDown = new Blob(
		[
			s2ab(
				XLSX.write(
					tmpWB,
					{
						bookType: type == undefined ? "xlsx" : type,
						bookSST: false,
						type: "binary",
					} //这里的数据是用来定义导出的格式类型
				)
			),
		],
		{
			type: "",
		}
	); //创建二进制对象写入转换好的字节流
	var href = URL.createObjectURL(tmpDown); //创建对象超链接
	document.getElementById(elementId).href = href; //绑定a标签
	document.getElementById(elementId).click(); //模拟点击实现下载
	setTimeout(function () {
		//延时释放
		URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
	}, 100);
}

function s2ab(s) {
	//字符串转字符流
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
	return buf;
}
// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
	let temCol = "",
		s = "",
		m = 0;
	while (n > 0) {
		m = (n % 26) + 1;
		s = String.fromCharCode(m + 64) + s;
		n = (n - m) / 26;
	}
	return s;
}

// 作者：关爱单身狗成长协会
// 链接：https://www.jianshu.com/p/74d405940305
// 來源：简书
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
