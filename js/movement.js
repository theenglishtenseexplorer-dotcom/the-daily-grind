import {nodes,edges,destinations} from './world.js';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class MovementController{
  constructor(onArrive){this.onArrive=onArrive;this.position={...nodes.start};this.route=[];this.target=null;this.speed=.42;this.moving=false;this.destination=null;this.lastProgress=0;}
  get locked(){return this.moving||!!this.destination;}
  findPath(startName,endName){
    const graph={}; for(const name of Object.keys(nodes))graph[name]=[];
    for(const [a,b] of edges){const cost=distance(nodes[a],nodes[b]);graph[a].push([b,cost]);graph[b].push([a,cost]);}
    const dist={},prev={},unvisited=new Set(Object.keys(nodes));for(const n of unvisited)dist[n]=Infinity;dist[startName]=0;
    while(unvisited.size){let current=null;for(const n of unvisited)if(current===null||dist[n]<dist[current])current=n;
      if(current===null||dist[current]===Infinity)break;unvisited.delete(current);if(current===endName)break;
      for(const [next,cost] of graph[current]){const alt=dist[current]+cost;if(alt<dist[next]){dist[next]=alt;prev[next]=current;}}
    }
    if(dist[endName]===Infinity)return null;const path=[];let cur=endName;while(cur){path.unshift(cur);cur=prev[cur];}return path;
  }
  nearestNode(){let best='start',d=Infinity;for(const [name,p] of Object.entries(nodes)){const n=distance(this.position,p);if(n<d){d=n;best=name;}}return best;}
  travelTo(id){
    if(this.locked||!destinations[id])return false;
    const start=this.nearestNode(),end=destinations[id].door,path=this.findPath(start,end);if(!path)return false;
    this.route=path.map(n=>({...nodes[n]}));if(distance(this.position,this.route[0])>.002)this.route.unshift({...this.position});
    this.destination=id;this.moving=true;this.lastProgress=0;return true;
  }
  update(dt){
    if(!this.moving||!this.route.length)return;
    let remaining=this.speed*dt;
    while(remaining>0&&this.route.length){const p=this.route[0],d=distance(this.position,p);if(d<.001){this.position={...p};this.route.shift();continue;}
      const step=Math.min(remaining,d),t=step/d;this.position.x+=(p.x-this.position.x)*t;this.position.y+=(p.y-this.position.y)*t;remaining-=step;this.lastProgress+=step;
    }
    if(!this.route.length){this.moving=false;const id=this.destination;this.destination=null;this.onArrive(id);}
  }
  restoreAt(nodeName){this.position={...(nodes[nodeName]||nodes.start)};this.route=[];this.moving=false;this.destination=null;}
}
