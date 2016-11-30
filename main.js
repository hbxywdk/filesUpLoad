function qst(ele){
	return typeof ele!== 'string' ? '' : document.querySelector(ele);
}
var content=qst('.content'),//拖拽主容器
	mF=qst('#mainForm'),//表单
	dash=qst('.dash'),//表单
	dashH2=qst('#mainForm h2'),//H2
	dashP=qst('#mainForm p'),//P
	input=qst('#fileBox'),//input
	upLoadNow=qst('.upLoadNow'),//正在读取主容器
	p_of_jd=qst('.p_of_jd'),//正在读取的进度
	jd=qst('.jd'),//进度条
	file_name=qst('.file_name'),//正在读取的文件名
	commit=qst('.commit'),//提交
	listUl=qst('.list ul'),//ul
	dataArr=[];//文件数组

/**
 * [createForm]
 * @param  {[type]} file [文件总列表]
 */
function createForm(file){
	var len=file.length,j=0;
	!function read(){
		if (!window.FileReader) {alert('您的浏览器不支持文件读取');return;}
		if (file[j].type=='') {alert('请拖入文件！');return;}//屏蔽type为 '' 的文件

		var reader = new FileReader(); //FileReader
		reader.readAsBinaryString(file[j]);//读取成二进制文件
		if (file[j].size>26214400) {alert('请不要上传大于25M文件');return;}	console.log('size',file[j].size);
		//当前读取文字信息
		p_of_jd.innerText='Uploading ' + (j+1) + ' of ' + len + ' files';
		file_name.innerText=file[j].name;
		//读取进度
		reader.onprogress=function(e){
			var jindu=(e.loaded/e.total).toFixed(2)*100+'%'
			console.log( jindu )
			upLoadNow.style.display="block";
			jd.style.width=jindu;
		}
		//单个文件读取完成
		reader.onload=function(e){
			//this.result.index=j;//
			dataArr.push([j,this.result,file[j].name]);//（增加文件索引 文件二进制 文件名） 文件数组压入新文件
			addList(file[j].name,j);//增加列表
			//console.log(dataArr)

			if(j>=len-1) {
				setTimeout(function(){
					upLoadNow.style.display="none";
				},1000);
				input.outerHTML=input.outerHTML;//清空input
				input=qst('#fileBox');//重新获取input
				input.addEventListener('change',inputChange,false);//重新绑定
				console.log(dataArr)
			}
			!(j>=len-1) && read(++j);
			//console.log(this.result)//读到的结果
			//document.write('<img src='+this.result+'>')

		}
	}()

}
/**
 * [addList 添加列表]
 * @param {[type]} fileName [文件名]
 */
function addList(fileName,j){//添加列表
	var li_=document.createElement('li'),
		li_i_1=document.createElement('i'),
		li_span=document.createElement('span'),
		li_i_2=document.createElement('em');
		li_i_1.className='file';
		li_span.innerText=fileName;
		li_i_2.className='close';
		li_i_2.dataset.ind=(dataArr.length-1);//增加data-ind 删除时使用
		li_.appendChild(li_i_1);
		li_.appendChild(li_span);
		li_.appendChild(li_i_2);
		listUl.appendChild(li_);
}
/**
 * [delFile 删除文件]
 * @param  {[type]} fileNum [要删除的索引]
 */
function delFile(fileNum){
	//console.log(fileNum)
	dataArr.splice(fileNum,1);
}
listUl.addEventListener('click',function(e){
	//console.log(e.target.nodeName.toLowerCase())
	if ( e.target.nodeName.toLowerCase()=='em') {
		console.log(e.target.dataset.ind)
		delFile(e.target.dataset.ind);
	}
	
},false);

function _submit(){
/*	var form=new FormData();
	form.append('name',2);*/
	var oReq = new XMLHttpRequest();
	oReq.onreadystatechange = function(){
	    if(oReq.readyState == 4 && oReq.status == 200){   
	        var b = oReq.responseText;    
			console.log(b);     
			alert('上传成功') 
			window.location.reload();//上传成功刷新页面    
	    }  
	}; 
	oReq.open("POST", "./main.php");
	oReq.upload.onprogress=function(e){
			var jindu=(e.loaded/e.total).toFixed(2)*100+'%'
			console.log( jindu )
	}
	oReq.send(dataArr);
}

commit.addEventListener('click',_submit,false)

function inputChange(){
	createForm(this.files)
}
function _dragenter(e){
	e.stopPropagation();
	e.preventDefault();
}
function _dragover(e){
    e.stopPropagation();  
    e.preventDefault();  	
    dash.classList.add('ondrag');
    dashH2.innerHTML="Drop to upload your files";
    dashP.style.display="none";
}
function _dragleave(e){
	dash.classList.remove('ondrag');
    dashH2.innerHTML="Drag files here to add them to your repository";
    dashP.style.display="block";
}
function _drop(e){
    e.stopPropagation();  
    e.preventDefault();  
	dash.classList.remove('ondrag');
    dashH2.innerHTML="Drag files here to add them to your repository";
    dashP.style.display="block";
    console.log(e.dataTransfer.files)

	createForm(e.dataTransfer.files);
}
input.addEventListener('change',inputChange,false);
content.addEventListener('dragenter',function(e){ _dragenter(e) },false);
content.addEventListener('dragover',function(e){ _dragover(e) },false);
content.addEventListener('dragleave',function(e){ _dragleave(e) },false);
content.addEventListener('drop',function(e){ _drop(e) },false);
