
var BASE_FS_DB_PATH = "fs://res/";
var BASE_FS_DB_NAME = "ilvtu";
var sqlite_db;

//Init database
function openDB(callback) {
    isDBExist(function(is_true) {
        if (is_true) {
            sqlite_db = api.require('db');
            sqlite_db.openDatabase({
                name : BASE_FS_DB_NAME,
                path : BASE_FS_DB_PATH + BASE_FS_DB_NAME + '.db'
            }, function(ret, err) {
                if (ret.status) {
                    callback(true);
                } else {
                    //重建数据库文件
                    api.toast({
                        msg : '数据库文件损坏，正在为您重建，请稍后'
                    });
                    var fs = api.require('fs');
                    fs.createFile({
	                    path: BASE_FS_DB_PATH + BASE_FS_DB_NAME + '.db'
                    }, function(ret, err) {
                        if (ret.status) {
                            sqlite_db = api.require('db');
                            sqlite_db.openDatabase({
                                name : BASE_FS_DB_NAME,
                                path : BASE_FS_DB_PATH + BASE_FS_DB_NAME
                            }, function(ret, err) {
                                if (ret.status) {
                                    api.hideProgress();
                                    dbCreateTable(function(is_true) {
                                        if(is_true){
                                            callback(true);
                                        } else{
                                            alert('Create table failed.');
                                            callback(false);
                                        }
                                    });
                                } else {
                                    api.hideProgress();
                                    api.alert({msg:err.msg});
                                    callback(false);
                                }
                            });
                        } else {
                            api.alert({
                                msg : err.msg
                            });
                            callback(false);
                        }
                    });
                }
            });
        } else{
            //重建数据库文件
            var fs = api.require('fs');
//            fs.copyTo({
//                    oldPath : 'widget://res/db/ilvtu.db',
//                    newPath : BASE_FS_DB_PATH
            fs.createFile({
	            path: BASE_FS_DB_PATH + BASE_FS_DB_NAME + '.db'
            }, function(ret, err) {
                if (ret.status) {
                    //alert('create db file success.');
                    sqlite_db = api.require('db');
                    sqlite_db.openDatabase({
                        name : BASE_FS_DB_NAME,
                        path : BASE_FS_DB_PATH + BASE_FS_DB_NAME
                    }, function(ret, err) {
                        if (ret.status) {
                            dbCreateTable(function(is_true) {
                                if(is_true){
                                    callback(true);
                                } else{
                                    alert('Create table failed.');
                                    callback(false);
                                }
                            });
                        } else {
                            api.alert({msg:err.msg});
                            callback(false);
                        }
                    });
                } else {
                    api.alert({
                        msg : err.msg
                    });
                    callback(false);
                }
            });
        }
    });

}

/**
* 创建数据库
*/
function dbCreateTable(callback) {
    //owner_id = $api.getStorage('uid');
    sqlite_db = api.require('db');
    //打开数据库，若数据库不存在则创建数据库
    openDB(function(is_true) {
        if (is_true) {
            //片段index表 创建 PianduanIndex drop table IF EXISTS PianduanIndex;   status：0,行进中，1，结束，2，保存到后台
            //curline_id 存放目前片段轨迹id
            var sql_frag_index = 'CREATE TABLE IF NOT EXISTS t_pianduan_index(frag_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, curline_id int,uid number(8), Addtime datetime, status INTEGER, CoverImg varchar(255),title varchar(50), Pianduaninfo varchar(400),fragid_db integer)';
            //片段内容表			 status：0,   ，1，修改，2，删除
            var sql_frag = 'CREATE TABLE IF NOT EXISTS t_pianduan(_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, frag_id INTEGER, uid number(8), link_url varchar(255), text_note varchar(400),serial_no number(10), speed number(3),direction number(3),altitude number(3),media_type varchar(1), lng double, lat double,timestamp datetime,id_db integer,status int)';
             //片段轨迹表 
             var sql_fragline = 'CREATE TABLE IF NOT EXISTS t_pianduanline(_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, frag_id INTEGER, uid number(8),  serial_no number(10), altitude number(3), lng double, lat double,timestamp datetime,line_id int,id_db integer,status int)';
           
            //游记index表                      status 0，新建 ,2，保存到后台
            var sql_youji_index = 'CREATE TABLE IF NOT EXISTS t_youji_index(yj_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, status int,startdate datetime, enddate datetime, title varchar(20), yjinfo nvarchar(400),coverimage varchar(50),uid number(8),yjid_db integer)';
            //游记内容表			status：0,   ，1，修改，2，删除
            var sql_youji = 'CREATE TABLE IF NOT EXISTS t_youji(_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, yj_id INTEGER, uid number(8), link_url varchar(255), text_note varchar(400),serial_no number(10), speed number(3),direction number(3),altitude number(3),media_type varchar(1), lng double, lat double,timestamp datetime, id_db integer,status int)';
            //我的信息表
            var sql_self_info = 'CREATE TABLE IF NOT EXISTS t_self_info(_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, phone_no nvarchar(20), token number(8), yjnumber number(4), focusnum number(4), focusednum number(4), nick varchar(20), sex varchar(1), birthday nvarchar(20), userphoto varchar(2), slogan varchar(100))';
            //
            //创建我的信息表
            dbExecuteSql(sql_self_info, function(is_flag) {
                if (is_flag) {
                    //创建片段index表
                    dbExecuteSql(sql_frag_index, function(is_flag) {
                        if (is_flag) {
                            //创建片段内容表
                            dbExecuteSql(sql_frag, function(is_flag) {
                                if (is_flag) {
	                                 dbExecuteSql(sql_fragline, function(is_flag) {
	                               		 if (is_flag) {
	                                    	//创建游记index表
		                                    dbExecuteSql(sql_youji_index, function(is_flag) {
		                                        if (is_flag) {
		                                            //创建游记内容表
		                                            dbExecuteSql(sql_youji, function(is_flag) {
		                                                if (is_flag) {
		                                                    callback(true);
		                                                } else {
		                                                    callback(false);
		                                                }
		                                            });
		                                        } else {
		                                            callback(false);
		                                        }
		                                    });
		                                  }else{
                                   			 callback(false);
		                                  }	
		                               });	                                  
                                } else {
                                    callback(false);
                                }
                            });
                        } else {
                            callback(false);
                        }
                    });
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    });
}

function dbCheckTableSync(callback) {
    sqlite_db = api.require('db');
    var query_stat = "SELECT COUNT(*) FROM ilvtu WHERE type='table' AND name=";

    //Check table is exist. If not, create it.
    //table 't_self_info'
    var table_name = "'t_self_info'";
    var sql = query_stat + table_name;
    var ret = sqlite_db.selectSqlSync({
        name: BASE_FS_DB_NAME,
        sql: sql
    });
    if(ret.status){
        sql = 'CREATE TABLE IF NOT EXISTS t_self_info(_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, phone_no nvarchar(20), token number(8), yjnumber number(4), focusnum number(4), focusednum number(4), nick varchar(20), sex varchar(1), birthday nvarchar(20), userphoto varchar(2), slogan varchar(100))';
        var retl = sqlite_db.executeSqlSync({
            name: BASE_FS_DB_NAME,
            sql: sql
        });
        if(retl.status){
            JSON.stringify(retl);
        } else{
            //api.alert({msg:table_name+ret.msg});
            callback(false);
        }
    } else{
        //api.alert({msg:table_name+ret.msg});
        callback(false);
    }

    //table 't_pianduan_index'
    table_name = "'t_pianduan_index'";
    sql = query_stat + table_name;
    ret = sqlite_db.selectSqlSync({
        name: BASE_FS_DB_NAME,
        sql: sql
    });
    if(ret.status){
        sql = 'CREATE TABLE IF NOT EXISTS t_pianduan_index(frag_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,curline_id int, uid number(8), Addtime datetime, status INTEGER, CoverImg varchar(255), title varchar(50), Pianduaninfo varchar(400),fragid_db integer)';
        var retl = sqlite_db.executeSqlSync({
            name: BASE_FS_DB_NAME,
            sql: sql
        });
        if(retl.status){
            JSON.stringify(retl);
        } else{
            //api.alert({msg:table_name+ret.msg});
            callback(false);
        }
    } else{
        //api.alert({msg:table_name+ret.msg});
        callback(false);
    }

    //table 't_pianduan'
    table_name = "'t_pianduan'";
    sql = query_stat + table_name;
    ret = sqlite_db.selectSqlSync({
        name: BASE_FS_DB_NAME,
        sql: sql
    });
    if(ret.status){
        sql = 'CREATE TABLE IF NOT EXISTS t_pianduan(_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, frag_id INTEGER, uid number(8), link_url varchar(255), text_note varchar(400),serial_no number(10), speed number(3),direction number(3),altitude number(3),media_type varchar(1), lng double, lat double,timestamp datetime,id_db integer,status int)';
        var retl = sqlite_db.executeSqlSync({
            name: BASE_FS_DB_NAME,
            sql: sql
        });
        if(retl.status){
            JSON.stringify(retl);
        } else{
            //api.alert({msg:table_name+ret.msg});
            callback(false);
        }
    } else{
        //api.alert({msg:table_name+ret.msg});
        callback(false);
    }

	 //table 't_pianduanline'
    table_name = "'t_pianduanline'";
    sql = query_stat + table_name;
    ret = sqlite_db.selectSqlSync({
        name: BASE_FS_DB_NAME,
        sql: sql
    });
    if(ret.status){
        sql = 'CREATE TABLE IF NOT EXISTS t_pianduanline(_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, frag_id INTEGER, uid number(8),  serial_no number(10), altitude number(3), lng double, lat double,timestamp datetime,line_id int,id_db integer,status int)';
        var retl = sqlite_db.executeSqlSync({
            name: BASE_FS_DB_NAME,
            sql: sql
        });
        if(retl.status){
            JSON.stringify(retl);
        } else{
            //api.alert({msg:table_name+ret.msg});
            callback(false);
        }
    } else{
        //api.alert({msg:table_name+ret.msg});
        callback(false);
    }

    //table 't_youji_index'
    table_name = "'t_youji_index'";
    sql = query_stat + table_name;
    ret = sqlite_db.selectSqlSync({
        name: BASE_FS_DB_NAME,
        sql: sql
    });
    if(ret.status){
        sql = 'CREATE TABLE IF NOT EXISTS t_youji_index(yj_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,status int, startdate datetime, enddate datetime, title varchar(20), yjinfo nvarchar(400), coverimage varchar(50),uid number(8),yjid_db integer)';
        var retl = sqlite_db.executeSqlSync({
            name: BASE_FS_DB_NAME,
            sql: sql
        });
        if(retl.status){
            JSON.stringify(retl);
        } else{
            //api.alert({msg:table_name+ret.msg});
            callback(false);
        }
    } else{
        //api.alert({msg:table_name+ret.msg});
        callback(false);
    }

    //table 't_youji'
    table_name = "'t_youji'";
    sql = query_stat + table_name;
    ret = sqlite_db.selectSqlSync({
        name: BASE_FS_DB_NAME,
        sql: sql
    });
    if(ret.status){
        sql = 'CREATE TABLE IF NOT EXISTS t_youji(_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, yj_id INTEGER, uid number(8), link_url varchar(255), text_note varchar(400),serial_no number(10), speed number(3),direction number(3),altitude number(3),media_type varchar(1), lng double, lat double,timestamp datetime,id_db integer,status int)';
        var retl = sqlite_db.executeSqlSync({
            name: BASE_FS_DB_NAME,
            sql: sql
        });
        if(retl.status){
            JSON.stringify(retl);
        } else{
            //api.alert({msg:table_name+ret.msg});
            callback(false);
        }
    } else{
        //api.alert({msg:table_name+ret.msg});
        callback(false);
    }

    callback(true);
}

/**
* 执行sql
*/
function dbExecuteSql(sqlite_sql, callback) {
    sqlite_db = api.require('db');

    sqlite_db.executeSql({
        name : BASE_FS_DB_NAME,
        sql : sqlite_sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
        } else {
        	alert(JSON.stringify(err));
            api.toast({
                msg : '获取会话信息失败，为您恢复数据，请稍后重试'
            });
            openDB(function(is_true) {
                if (is_true) {
                        callback(true);
                } else {
                        callback(false);
                }
            });
        }
    });
}

/**
* 查询sql
* @param {Object} sqlite_sql
* @param {Object} callback
*/
function dbSelectSql(sqlite_sql, callback) {
    sqlite_db = api.require('db');

    sqlite_db.selectSql({
        name : BASE_FS_DB_NAME,
        sql : sqlite_sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
        } else {
            api.toast({
                msg : '获取会话信息失败，为您恢复数据，请稍后'
            });
//            openDB(function(is_true) {
//                if (is_true) {
//                    callback(true);
//                } else {
                    callback(false);
//                }
//            });
        }
    });

}

function dbAlterTable(t_name, create_table) {
    sqlite_db = api.require('db');
    owner_id = $api.getStorage('uid');
    //打开数据库，若数据库不存在则创建数据库
    openDB(function(is_true) {
        if (is_true) {
            //创建会话表 t_hh_messages
            var sql = 'ALTER TABLE ' + t_name + ' RENAME TO ' + t_name + '_temp_old;';
            //创建数据库
            dbExecuteSql(sql, function(is_flag) {
                if (is_flag) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    });
}

function isDBExist(callback) {
    fs = api.require('fs');
    //判断当前是否存在db
    fs.exist({
        path : BASE_FS_DB_PATH + BASE_FS_DB_NAME + '.db'
    }, function(ret, err) {
        if (ret.exist) {
            //alert('DB file is exist.');
            callback(true);
        } else {
            //alert('No DB file is exist.');
            callback(false);
        }
    });
}


/**
* 升级数据库版本
*/
function checkSqliteDbBanben(callback) {
    var sql = 'SELECT config_value FROM t_sys_config;';
    dbSelectSql(sql, function(data_attr) {
        var config_bb = 0;
        (data_attr.length == 0) ? ( config_bb = 1) : ( config_bb = data_attr[0].config_value);
        if (config_bb == 1) {
            api.hideProgress();
            var t = "对不起，您当前版本需要升级，请重新登录";
            api.execScript({
                name : 'root',
                frameName : 'hh_index',
                script : 'openNoticeLogout("' + t + '\");'
            });
        } else {
            callback(true);
        }
    });
}