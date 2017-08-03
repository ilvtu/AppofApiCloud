 function back() {	
 	setTimeout(function () {    
       api.closeWin();      
    }, 100);
    
}
var token='';
var localuid='';
var timeout='';
var startDate, endDate, selectDate;
var tmpsdate,tmpedate;
 apiready = function(){
 	
	
	var header = $api.dom('.header');
	$api.fixIos7Bar(header);
    $api.fixStatusBar(header);
    
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
    	
    	api.closeWin();    	
    });
    
 	api.addEventListener({
        name:'viewappear'
    },function(ret,err){
        //operation	        
		init();
    });
    
    
 };

function init(){
	localuid= $api.getStorage('localuid');
	token= $api.getStorage('token');
	
	timeout=$api.getStorage('timeout');
	var curtime = new Date();
	if((timeout*1000-curtime)<0){
		api.openWin({
	        name: 'login',
	        url: 'login.html',
	        opaque: true,
	        vScrollBarEnabled: false
	    });
		 
	}

}


function createnewyj(callback){
	var db = api.require('db');
	//sDate="2001-09-09";	
  	//eDate="2001-10-09";
	var createYjstr ='insert into t_youji_index(yj_id,yjinfo,startdate,enddate,uid,status) values(null,'+'""'+',"'+startDate+'","'+endDate +'","'+localuid+'",0)';	
	db.executeSql({
	    name: 'ilvtu',
	    sql: createYjstr
	}, function(ret, err) {
		
	    if (ret.status) {	
			var sqlstr ='select max(yj_id) as c from t_youji_index';	
			db.selectSql({
			    name: 'ilvtu',
			    sql: sqlstr
			}, function(ret, err) {
			    if (ret.status) {
			        //alert(JSON.stringify(ret));
			        
			        var curYjId = ret.data[0].c;
			        callback(curYjId);
			      	/*
			        api.openWin({
				        name: 'edityj',
				        url: 'edityj.html',
				        opaque: true,
				        vScrollBarEnabled: false,
				        pageParam:{
				        	yid:curYjId
				        }
			    	});
			        */
			        //alert(JSON.stringify(ret.data));
			    } else {
			    	callback(null);
			    	//alert(JSON.stringify(err));
			    }
			});
		  
	        //alert(JSON.stringify(ret));
	    } else {
	    	callback(null);
	    	//alert(JSON.stringify(err));
	    }
	});
	
}

/*
 * 先在本地数据库存取yj_index,再将后台保存的pianduan存入本地的yj表
 */
function autoCreate(){
	createnewyj(function(curYjId){
		
		if(curYjId!=null){
			 pickoutFragId(function(data){
		        if(data.length > 0){
		            //alert('data length:'+data.length);
		            //Pick out pianduan by 'frag_id'.
		            var i=0;
		            var k=0;
		            for(var i=0,len=data.length; i<len; ++i){
		            	
		            	if(data[i].fragid_db!=null && data[i].fragid_db!=''){
			            	getPianduanByFragid(curYjId,data[i].fragid_db,function(status){
			                	if(status){		                		
			                		i++;
			                	}
			                	if((k*1.0+i*1.0)==data.length){
			                		api.openWin({
								        name: 'edityj',
								        url: 'edityj.html',
								        opaque: true,
								        vScrollBarEnabled: false,
								        pageParam:{
								        	yid:curYjId
								        }
							    	});           	
			                	}
			                });
		                }
		                else{
							k++;		                
		                }
		                //callback(youji_id);
		            }
		        }
		         api.openWin({
			        name: 'edityj',
			        url: 'edityj.html',
			        opaque: true,
			        vScrollBarEnabled: false,
			        pageParam:{
			        	yid:curYjId
			        }
		    	});
		    });
		}
		else{		 	
		}
	});
   
}  

//var frag_list = [];//考虑

function pickoutFragId(callback){
    var time = new Date(startDate);//new Date(Date.parse(sDate.replace(/-/g,"/")));
    var start = time.Format("yyyy-MM-dd hh:mm:ss");
    
    time = new Date(endDate);
    var end = time.Format("yyyy-MM-dd hh:mm:ss");//new Date(Date.parse(eDate.replace(/-/g,"/")));
    //要获得后台的fragid_db
    sql = "SELECT fragid_db FROM t_pianduan_index  WHERE Addtime>'" + start + "' AND Addtime<'" + end + "'";// AND uid='" + uid +"'";
    //alert(sql);
    
    dbSelectSql(sql, function(data_attr){
    
        if(null != data_attr || 0 == data_attr.length){
            if(0 == data_attr.length){
                callback(data_attr);//无符合日期的片段
            }else{
            	
            	
                callback(data_attr);//无符合日期的片段
                //To be used.
                //saveFragidInList(data_attr, function(id){
                //    callback(id);//返回新创建的id.
                //});
            }
        } else{
            api.alert({msg : '执行查询命令失败'});
        }
    });
}

/*
 * 暂时没用--wl20170710
 */
function saveFragidInList(data_attr, callback){
    for(var i=0,len=data_attr.length; i<len; ++i){
        //frag_list[cur] = data_attr[i].frag_id;
        //cur++;
        //data_attr[i].uid
        getPianduanByFragid(data_attr[i].frag_id);
            //callback(youji_id);        
    }
    
    sql_db.transaction({
        name: 'ilvtu',
        operation: 'commit'
    }, function(ret, err){
        if(ret.status){
            query();
            alert('Commit success.');
        } else{
            console.log('Commit failed.');
        }
    });
}


/*
 * 
 * wl20170710修改，从后台接口返回保存的pianduan内容,存入本地yj表
 */
var get_pianduan_num;
var insert_youji_num;

function getPianduanByFragid(curYjId,fragment,callback){
    //sql = "SELECT link_url,text_note FROM t_pianduan WHERE frag_id='"+fragment+"'";
    //alert(sql);
    
    //从后台接口获取pianduan数据
    
	var bodyparam={
		token:token,
		frag_id:fragment
	}			
	
	api.ajax({
	    url: 'http://47.92.118.125/fragment/get.php',
	    method: 'post',
	    data: {
	    	body:bodyparam
	    }
	}, function(ret, err) {	
	
	    	
	    if (ret && ret.data!=null && ret.data!='') {
	    	
	    	if(null!=ret.data.records  && ret.data.records!='' ){
	    		
	    	//|| 0== ret.data.records.length){
	    		/*
	    		if(0== ret.data.records.length){
	    			callback(true);
	    		}
	    		else{
	    		}
	    		*/
	    		var data_attr= ret.data.records;
	    		
    			var j=0;
    			var k=0;
    			 for(var i=0,len=data_attr.length; i<len; ++i){
                    var link = data_attr[i].link_url;
                    var note = data_attr[i].text_note;
                    var lng = data_attr[i].lng;
                    
                    var lat = data_attr[i].lat;
                    var timestamp= data_attr[i].timestamp;
					var come_from=1;
					var	speed=data_attr[i].speed;
					var	direction =data_attr[i].direction;
					var	altitude=data_attr[i].altitude;
					var	media_type=data_attr[i].media_type;
                    
                    
                    var db = api.require('db');
					db.selectSql({
			            name:'ilvtu',
			            sql:'select max(serial_no) as c from t_youji where yj_id='+curYjId
			        },function(ret,err){
			        	//coding...
			        	if(ret.status){
			        		var newserial_no = ret.data[0].c*1.0+1;
			        		var insertsql = "INSERT INTO t_youji (yj_id, uid, link_url, text_note,serial_no,lng,lat,timestamp,speed,direction,altitude,media_type)";
		                    insertsql+= " VALUES ('"+curYjId+"','"+ localuid+"','"+ link+"','"+ note +"','";
		                     insertsql+= newserial_no +"','"+lng+"','"+lat+"','"+timestamp+"','"+speed+"','"+direction+"','"+altitude+"','"+media_type+"')";
		                    dbExecuteSql(insertsql, function(is_flag) {
		                        k++;
		                        if (is_flag) {
		                            j++;
		                            //callback(true);
		                        } else {
		                            //callback(false);
		                        }	                        
		                        if(k==data_attr.length ){
		                        	
		                        	if( j==data_attr.length){
		                        		callback(true);
		                        	}
		                        	else{
		                        		callback(false);
		                        	}
		                        }
		                        
		                    });
			        		
                    	}
                    	else{
                    	
                    		callback(false);
                    	}
                    });
                    
                    
                    //To be verified.
                }
	    	}
	    	else{
	    		callback(false);
	    	}
	    	
	    }
	    else{
	    alert(3);
	    	callback(false);
	    }
	});
    
    /*
    dbSelectSql(sql, function(data_attr){
        if(null != data_attr || 0 == data_attr.length){
            if(0 == data_attr.length){
                callback(data_attr);//无符合日期的片段
            }else{
                var link, note;
                var yj_id=111111;//for test.
                for(var i=0,len=data_attr.length; i<len; ++i){
                    link = data_attr[i].link_url;
                    note = data_attr[i].text_note;
                    sql = "INSERT INTO t_youji (yj_id, uid, link_url, text_note) VALUES ('"+yj_id+"','"+ localuid+"','"+ link+"','"+ note+"')";
                    dbExecuteSql(sql, function(is_flag) {
                        if (is_flag) {
                            insert_youji_num++;
                            //callback(true);
                        } else {
                            //callback(false);
                        }
                    });
                    //To be verified.
                }
            }
        } else{
            api.alert({msg : '执行查询命令失败'});
        }
    });
    */
}

Date.prototype.Format = function(fmt) { //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

/*Draw Calendar on 'pickdateandtime' page.*/

var $$ = function(id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};

var Class = {
    create : function() {
        return function() {
            this.initialize.apply(this, arguments);
        }
    }
}

Object.extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}

var Calendar = Class.create();

Calendar.prototype = {
    initialize : function(container, options) {
        this.Container = $$(container);
        //容器(table结构)
        this.Days = [];
        //日期对象列表
        this.SetOptions(options);
        this.Year = this.options.Year;
        this.Month = this.options.Month;
        this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
        this.onSelectDay = this.options.onSelectDay;
        this.onToday = this.options.onToday;
        this.onFinish = this.options.onFinish;
        this.Draw();
    },
	//设置默认属性
	SetOptions : function(options) {
		this.options = {//默认值
			Year : new Date().getFullYear(), //显示年
			Month : new Date().getMonth() + 1, //显示月
			SelectDay : null, //选择日期
			onSelectDay : function() {
			}, //在选择日期触发
			onToday : function() {
			}, //在当天日期触发
			onFinish : function() {
			} //日历画完后触发
		};
		Object.extend(this.options, options || {});
	},
	//上一个月
	PreMonth : function() {
		//先取得上一个月的日期对象
		var d = new Date(this.Year, this.Month - 2, 1);
		//再设置属性
		this.Year = d.getFullYear();
		this.Month = d.getMonth() + 1;
		//重新画日历
		this.Draw();
	},
	//下一个月
	NextMonth : function() {
		var d = new Date(this.Year, this.Month, 1);
		this.Year = d.getFullYear();
		this.Month = d.getMonth() + 1;
		this.Draw();
	},
	//画日历
	Draw : function() {
		//用来保存日期列表
		var arr = [];
		//用当月第一天在一周中的日期值作为当月离第一天的天数
		for (var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) {
			arr.push("&nbsp;");
		}
		//用当月最后一天在一个月中的日期值作为当月的天数
		for (var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) {
			arr.push(i);
		}
		var frag = document.createDocumentFragment();
		this.Days = [];
		while (arr.length > 0) {
			//每个星期插入一个tr
			var row = document.createElement("tr");
			//每个星期有7天
			for (var i = 1; i <= 7; i++) {
				var cell = document.createElement("td");
				cell.innerHTML = "&nbsp;";
				if (arr.length > 0) {
					var d = arr.shift();
					cell.innerHTML = d;
					if (d > 0) {
						this.Days[d] = cell;
						//判断是否今日
						if (this.IsSame(new Date(this.Year, this.Month - 1, d), new Date())) {
							this.onToday(cell);
						}
						//判断是否选择日期
						if (this.SelectDay && this.IsSame(new Date(this.Year, this.Month - 1, d), this.SelectDay)) {
							this.onSelectDay(cell);
						}
					}
				}
				row.appendChild(cell);
			}
			frag.appendChild(row);
		}
		//先清空内容再插入(ie的table不能用innerHTML)
		while (this.Container.hasChildNodes()) {
			this.Container.removeChild(this.Container.firstChild);
		}
		this.Container.appendChild(frag);
		this.onFinish();
	},
	//判断是否同一日
	IsSame : function(d1, d2) {
		return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
	},
	getSelectMonth : function() {
	    return this.Month;
	},
	getSelectYear : function() {
	    return this.Year;
	}
};

var cale = new Calendar("idCalendar", {
	SelectDay : new Date().setDate(10), //要选择的日期，可注释
	//			    onSelectDay: function(o){ o.className = "onSelect"; },   //增加 类
	onToday : function(o) {
		o.className = "onToday";
	},
	onFinish : function() {
		$$("idCalendarYear").innerHTML = this.Year;
		$$("idCalendarMonth").innerHTML = this.Month;
		//表头年份
		// 		            var flag = [10,15,20];     //判断选择是不是指定日期
		//			        for(var i = 0, len = flag.length; i < len; i++){
		//			            this.Days[flag[i]].innerHTML = "<a href='javascript:void(0);' onclick=\"alert('日期是:"+this.Year+"/"+this.Month+"/"+flag[i]+"');return false;\">" + flag[i] + "</a>";
		//			        }
	}
});

$$("idCalendarPre").onclick = function() {
	cale.PreMonth();
}

$$("idCalendarNext").onclick = function() {
	cale.NextMonth();
}

//var startDate = null, endDate = null, electDate = null;

//点击表格里面的值
var tb = document.getElementById('idCalendar');
tb.onclick = function(e) {

	//alert(typeof e.target.innerHTML); //看一下输出是什么类型
	if (e.target.innerHTML == "&nbsp;")
		alert('空');
	if (e.target.innerHTML !== "&nbsp;") {
		var num = e.target.innerText;
		//alert(e.target.innerHTML + ":" + e.target.nodeName);//输出鼠标所点击的格子里面的值
		//遍历表格
		var arr = new Array();
		for (var i = 0; i < tb.rows.length; i++) {
			for (var j = 0; j < tb.rows[i].cells.length; j++) {
				if (num == tb.rows[i].cells[j].innerText) {
					//alert(num);
					//selectDate =  e.target.innerHTML;
					selectDate = cale.getSelectYear() + '-' +
					             cale.getSelectMonth() + '-' +
					             num;
				}
			}
		}
		
		if(null == tmpsdate){
			tmpsdate = selectDate;
		    startDate = selectDate;
		    $api.byId('sdate').innerHTML= startDate;
		    $api.byId('edate').innerHTML='';		    
		    $api.byId('pnum').innerHTML='';
			//alert(startDate);
		}
		else{
		    endDate = selectDate;
			tmpedate = selectDate;
			var date1 = new Date(startDate);
			var date2 = new Date(endDate);
			if(date2<date1){
				alert("选择旅行结束时间早于开始时间！");
				  startDate=null;
				  endDate=null;
				  tmpsdate=null;
				  tmpedate=null;
				  $api.byId('sdate').innerHTML= '';
	    		  $api.byId('edate').innerHTML='';
	    		  $api.byId('pnum').innerHTML='';
			}
			else{	    		
			    tmpsdate=null;
				//tmpedate=null;
			    $api.byId('edate').innerHTML= endDate;
			    
			    pickoutFragId(function(data){
			        if(data.length > 0){
			            $api.byId('pnum').innerHTML= data.length;
			        }
			        else{
			        	$api.byId('pnum').innerHTML= 0;
			        }
			    });
		    }
			//alert(endDate);
		}
	}
}