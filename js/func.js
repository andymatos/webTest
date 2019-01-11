// JavaScript Document
var session_key = $.cookies.get('session_key');
var session_power =$.cookies.get('session_power');
var session_id = $.cookies.get('session_id');
var AvailableLanguages = {
	'en': "English",
	'zh-cn': "Chinese Simplified"
};

function isLogin(){
	if(session_id == undefined || session_id==null || session_id==""){
		$.cookies.del('session_id');
		$.cookies.del('session_key');
		$.cookies.del('session_power');
		//window.location = "index.html";
		return false;
	}
		
	if(session_key == undefined || session_key == null || session_key == ""){
		$.cookies.del('session_id');
		$.cookies.del('session_key');
		$.cookies.del('session_power');
		//window.location = "index.html";
		return false;
	}
	
	return true;
}
function getBrowerLanguage(){
	var sUserLang ;
	sUserLang = $.cookies.get('language');
	if (sUserLang == "" || sUserLang == null){
			if (navigator.userLanguage)
					{sUserLang = navigator.userLanguage.toLowerCase();}
			else
			{
					if (navigator.language)
							{sUserLang = navigator.language.toLowerCase();}
					else
							{sUserLang = "en";}
			}
			
			if (sUserLang.length >= 5)
			{
					sUserLang = sUserLang.substr(0,5);
					if(AvailableLanguages[sUserLang])
					{
							$.cookies.set('language', sUserLang);
							return sUserLang;
					}
			}
			if (sUserLang.length >= 2)
			{
					sUserLang = sUserLang.substr(0,2);
					if(this.AvailableLanguages[sUserLang])
					{
							$.cookies.set('language', sUserLang);
							return sUserLang;
					}
			}
			$.cookies.set('language', sUserLang);
			return sUserLang;
	}
	else
	{
			return sUserLang;
	}
}
var defaultLanguage = getBrowerLanguage();
//$.getScript("language/"+defaultLanguage+".js");
function changeLanguage(languageCode){
	if(languageCode==undefined || languageCode=="")
		languageCode = 	defaultLanguage;
		
	$.getScript("language/"+languageCode+".js");
	$.cookies.set('language', languageCode);
	translate();
}

function translate(obj){
	return false;
	if(obj==undefined || typeof obj != "object"){
		var LTXT = $(".LTXT");
		var LINPUT = $(".LINPUT");
	}else{
		var LTXT = $(".LTXT", obj);
		var LINPUT = $(".LINPUT",obj);
	}
		
	LTXT.each(function(index){
		var nv = $(this).attr("av_lang");
		if(nv==undefined || nv=="")
			return false;
			
		$(this).text(eval('language.'+nv));
	});
	LINPUT.each(function(index){
		var nv = $(this).attr("av_lang");
		if(nv==undefined || nv=="")
			return false;
			
		$(this).val(eval('language.'+nv));
	});
}

function Readonly(dom){
	if(dom==undefined || dom=="")
		return false;
	
	if(session_power>=2){
		$(dom).each(function(i){
			if($("option",$(this)).length>0){
				$(this).attr("disabled",true);
			}else{
				$(dom).attr("readonly","readonly");	
				$(dom).removeClass("text").addClass("readonly");
			}
		});
	}
}
function removeBom(dom){
	if(dom==undefined || dom=="")
		return false;
	
	if(session_power>=2){
		$(dom).remove();
	}
}

function Getpager(count,page){
		var pager={};
		
		count=count==undefined?0:count;
		count=parseInt(count);
		
		page=page==undefined?1:page;
		page=parseInt(page);	
		
		pager.count = count;
		onepage = onepage==undefined?20:parseInt(onepage);
		pager.onepage = onepage;
		pager.pages = Math.ceil(count/onepage);
		if(page<=0){
				page=1;
		}else if(page>pager.pages){
				page=pager.pages;
		}
		pager.currpage = page;
		
		if(page<=1){
			pager.pre_page = 1;		
		}else{
			pager.pre_page = page-1;		
		}
		
		if(page>=pager.pages){
			pager.next_page = pager.pages;		
		}else{
			pager.next_page = page+1;		
		}		
		
		return pager;	
}


$.prototype.ajaxForm = function(options){
	var settings = {
		beforeSend:function(){}
	};
	
	$.extend(true, settings, options);
	var _this = $(this);
	settings.url = (settings.url==undefined || settings.url == "")?_this.attr("action"):settings.url;
	settings.method = (settings.method==undefined || settings.method == "")?_this.attr("method"):settings.method;
	settings.dataType = ($.browser.msie) ? "text" : "html";
	
	_this.submit(function(){
		_params = $("input,select,textarea",_this).serialize();

		if(settings.data != undefined)
			_params = _params + "&" +settings.data;

		if(settings.beforeSend != undefined && typeof settings.beforeSend == "function"){
			_before = settings.beforeSend();
			if(_before == false)
				return false;	
			else if(_before != undefined && _before != '' && typeof _before == "string")
				_params = _params + "&" + _before;
		}
		if(session_id != undefined)
			_params = _params +"&session_id="+session_id;
		if(session_key != undefined)
			_params = _params + "&session_key="+session_key;
			
		_params = _params+"&t="+new Date().getTime()
		
		$.ajax({
			url: settings.url,
			type: settings.method,
			data: _params,
			dataType: settings.dataType,
			success: function(data){
				data = data.replace(/<html>/g,"");
				data = data.replace(/<\/html>/g,"");
				data = eval('('+data+')');

				if(data.code == "login" || data.session_key == undefined){
					$.cookies.del('session_id');
					$.cookies.del('session_key');
					$.cookies.del('session_power')
					window.parent.location = "../index.html";
				}
				$.cookies.set('session_key',data.session_key);
				session_key = $.cookies.get('session_key');
				if(data.code){
					var code = data.code;
					if(code=="error"){
						if(settings.error != undefined && typeof settings.error == "function"){
							settings.error(data);	
						}else if(data.msg != undefined && data.msg != ''){
							alert(data.msg);
						}
					}
					else if(code=="warning"){
						alert(data.msg);
						settings.success(data);
					}
					else{
						if(data.msg && data.msg!="")
							alert(data.msg);
						settings.success(data);
					}
				}
				else{
					settings.success(data);
				}
			},
			error:function(){
				//alert("The system is error!");
			}
		});
		return false;
	});
};

$.extend({
	getxml:function(options){
			var settings = {
				type: 'get',
				dataType: 'text',
				success:function(){}
			};
			$.extend(true, settings, options);
			
			if(settings.url==undefined || settings.url == ""){
				alert("ajax error");
				return false;
			}
			
			settings.dataType = ($.browser.msie) ? "text" : "html";
			
			if(settings.beforeSend != undefined && typeof settings.beforeSend == "function"){
				_before = settings.beforeSend();
				
				if(_before == false)
					return false;	
				else if(_before != undefined && _before != '' && typeof _before == "string")
					settings.data = (settings.data==undefined || settings.data=="")?_before:settings.data+"&"+_before;
			}
			
			var _params = settings.data;
			if(session_id != undefined){
				_params = (_params=="" || _params==undefined)?"":_params+"&";
				_params = _params + "session_id="+session_id;
			}
			if(session_key != undefined){
				_params = (_params=="" || _params==undefined)?"":_params+"&";
				_params = _params + "session_key="+session_key;
			}			
			_params = _params+"&t="+new Date().getTime();
			
			$.ajax({
				url: settings.url,
				type: settings.type,
				data: _params,
				dataType: settings.dataType,
				success: function(data){
					data = data.replace(/<html>/g,"");
					data = data.replace(/<\/html>/g,"");
					data = eval('('+data+')');
					
					if(data.code == "login" || data.session_key == undefined){
						$.cookies.del('session_id');
						$.cookies.del('session_key');
						$.cookies.del('session_power')
						window.parent.location = "../index.html";
					}
					$.cookies.set('session_key',data.session_key);
					session_key = $.cookies.get('session_key');
					
					if(data.code){
						var code = data.code;
						if(code=="error"){
						    if(data.msg && data.msg!="")
							    alert(data.msg);
							if(settings.error && typeof settings.error == "function")
							    settings.error(data);
						}
						else if(code=="warning"){
							alert(data.msg);
							settings.success(data);
						}
						else{
							if(data.msg && data.msg!="")
								alert(data.msg);
							settings.success(data);
						}
					}
					else{
						settings.success(data);
					}
				},
				error:function(){
					try{
						settings.error();
					}catch(e){
						//alert("The system is error!");
					};
				}
			});
	}
});