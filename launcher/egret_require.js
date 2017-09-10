//入口函數对象
egret_h5 = {};
//前缀
egret_h5.prefix = "";
//加载script，
egret_h5.loadScript = function (list, callback) {
    var loaded = 0;
    var loadNext = function () {
        //调用加载单个js函数，传入src路径，以及回调函数
        egret_h5.loadSingleScript(egret_h5.prefix + list[loaded], function () {
            //每执行一次，就自增,当需要加载的script函数小于loaded时，就执行回调函数，负责继续加载script
            loaded++;
            if (loaded >= list.length) {
                callback();
            }
            else {
                loadNext();
            }
        })
    };
    loadNext();
};
//加载单个script标签函数，
egret_h5.loadSingleScript = function (src, callback) {
    var s = document.createElement('script');
    //判断script标签是否有自身的异步属性，如果有设置为false
    if (s.hasOwnProperty("async")) {
        s.async = false;
    }
    s.src = src;
    //调用每个script标签的load事件，当事件加载后再删除load事件，然后调用回调函数
    s.addEventListener('load', function () {
        this.removeEventListener('load', arguments.callee, false);
        callback();
    }, false);
    //将每个script文件添加到body中
    document.body.appendChild(s);
};

egret_h5.preloadScript = function (list, prefix) {
    //判断对象是否有预加载属性，如果没有则新建一个空数组
    if (!egret_h5.preloadList) {
        egret_h5.preloadList = [];
    }
    //将list数组中所有项加上前缀返回给预加载数组
    egret_h5.preloadList = egret_h5.preloadList.concat(list.map(function (item) {
        return prefix + item;
    }))
};
//这里是加载js文件入口
egret_h5.startLoading = function () {
    //首先获取到预加载的数组，
    var list = egret_h5.preloadList;
    egret_h5.loadScript(list, egret_h5.startGame);
};