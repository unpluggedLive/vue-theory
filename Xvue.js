class Xvue {
    constructor(options){
        this.$data = options.data; //保存data选项
        this.observer(this.$data); //执行响应式

        // new Watcher()
        // console.log('模拟compile',this.$data.test);
        this.$options = options;
        this.$compile = new Compile(options.el,this);
        
    }

    defineReactive(obj,key,val){

        this.observer(val) // 相当于递归遍历属性
        
        const dep = new Dep()

        //为data对象定义属性
        Object.defineProperty(obj,key,{
            enumerable: true,
            configurable: true,
            get(){
                Dep.target && dep.addDep(Dep.target)
                console.log(dep.deps);
                
                return val;
            },
            set(newVal){
                if(newVal == val){
                    return;
                }
                val = newVal
                console.log("数据发生变化");
                dep.notify()  //通知watcher
            }
        })
    }
    observer(value){
        //遍历data选项
        if(!value || typeof value !== 'object'){
            return;
        }
    
        Object.keys(value).forEach(key=>{
            //为每个key定义响应式
            this.defineReactive(value,key,value[key])
            //
            this.proxyData(key);
        })
    
    }
    
    proxyData(key){
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key]
            },
            set(newVal){
                this.$data[key] = newVal;
            }
        })
    }
}


//依赖管理器，负责将视图中所有依赖收集管理，包括依赖添加和通知
class Dep{
    constructor(){
        this.deps = []; // 存放Watcher的实例
    }
    addDep(dep){
        this.deps.push(dep);
    }
    //通知所有Watcher执行更新
    notify(){
        this.deps.forEach(dep=>{
            dep.update();
        })
    }
}
 //Watcher: 具体的更新执行者
 class Watcher{
     constructor(vm,key,cb){
         this.vm = vm;
         this.key = key;
         this.cb = cb;

         //将来new一个监听器时，将当前Watcher实例附加到Dep.target
         Dep.target = this;
         this.vm[this.key];
         Dep.target = null;
     }

     update(){
         console.log('视图更新');
         this.cb.call(this.vm, this.vm[this.key])
     }
 }

