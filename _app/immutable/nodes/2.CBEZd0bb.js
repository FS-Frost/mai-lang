var Ue=Object.defineProperty;var Be=(i,e,t)=>e in i?Ue(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var d=(i,e,t)=>(Be(i,typeof e!="symbol"?e+"":e,t),t);import{s as ve,n as fe,r as Ye,o as De}from"../chunks/scheduler.Bmg8oFKD.js";import{S as de,i as ge,s as N,e as m,t as ke,y as He,d as u,f as b,c as v,z as H,a as g,b as Le,o as h,g as K,h as c,A as ye,B as Ae,j as Ge,k as Ce,n as q,q as Xe,l as re,m as qe,u as Me,v as Ke,w as Ve,x as Fe}from"../chunks/index.B0U4Du-Q.js";import{w as Je}from"../chunks/index.D_GRTHN4.js";const Qe=!0,xt=Object.freeze(Object.defineProperty({__proto__:null,prerender:Qe},Symbol.toStringTag,{value:"Module"})),Ze=["home"],We=Ze.map(i=>i.toString()),Ie=Je();function et(i){return We.includes(i)}const tt="int",je="string",J="fn",pe=";",st=",",Y="(",F=")",G="{",Q="}",ze="=",Oe='"',Pe="/",Se="TOKEN_COMMENT",X="TOKEN_TYPE",T="TOKEN_NAME",me="TOKEN_INT",se="TOKEN_STRING",w="TOKEN_LITERAL";class rt{constructor(e,t,s){d(this,"filePath");d(this,"row");d(this,"column");this.filePath=e,this.row=t,this.column=s}display(){return`[${this.filePath}:${this.row}:${this.column+1}]`}}class V{constructor(e,t,s){d(this,"location");d(this,"name");d(this,"type");d(this,"value");this.location=e,this.name=t,this.type="",this.value=s}display(){return`[${this.name.padEnd(w.length," ")}]${this.location.display()} ${this.value}`}}class nt{constructor(e,t){d(this,"filePath");d(this,"source");d(this,"cursor");d(this,"column");d(this,"row");d(this,"lines");this.filePath=e,this.source=t,this.lines=t.split(`
`),this.cursor=0,this.column=0,this.row=1}isType(e){return[tt,je].includes(e)}isAlpha(e){return/^[a-zA-Z]$/.test(e)}isAlphaNumeric(e){return/^[a-zA-Z0-9]$/.test(e)}isDigit(e){return/^[0-9]$/.test(e)}isSpace(e){return e===" "||e===`
`||e==="	"||e==="\r"}advanceCursor(){if(this.isNotEmpty()){const e=this.source[this.cursor];this.cursor++,this.column++,e===`
`&&(this.column=0,this.row++)}}isEmpty(){return this.cursor>=this.source.length}isNotEmpty(){return!this.isEmpty()}isEndOfLine(){return this.source[this.cursor]===`
`}skipSpaces(){for(;this.isNotEmpty()&&this.isSpace(this.source[this.cursor]);)this.advanceCursor()}location(){return new rt(this.filePath,this.row,this.column)}display(){let t=this.lines[this.row-1]+`
`;for(let s=0;s<this.column;s++)t+="_";return t+="^",t}logLine(){console.log(this.display())}logLineError(){console.error(this.display())}tokenizeFunction(){let[e,t]=this.nextToken();if(t)return[null,t];if(e==null)return[null,`expecting ${T}, but got null`];if(e.name!==T)return[null,`expecting ${T}, but got ${e.name}`];if(e.value,[e,t]=this.nextToken(),t)return[null,t];if(e==null)return[null,`expecting ${Y}, but got null`];if(e.value!==Y)return[null,`expecting ${Y}, but got ${e.value}`];if([e,t]=this.nextToken(),t)return[null,t];if(e==null)return[null,`expecting ${F}, but got null`];if(e.value!==F)return[null,`expecting ${F}, but got ${e.value}`];if([e,t]=this.nextToken(),t)return[null,t];if(e==null)return[null,`expecting ${G}, but got null`];if(e.value!==G)return[null,`expecting ${G}, but got ${e.value}`];let s=!1;for(;this.isNotEmpty();){if([e,t]=this.nextToken(),t)return[null,t];if(e==null)return[null,"expecting token, but got null"];if(e.name===w&&e.value===Q){s=!0;break}}return s?[null,""]:[null,`expecting ${Q}, but got null`]}nextToken(){for(this.skipSpaces();this.isEmpty();)return[null];const e=this.location(),t=this.source[this.cursor];if(t==Pe){if(this.isEmpty())throw new Error("bad comment");if(this.advanceCursor(),this.source[this.cursor]!==Pe)throw new Error("bad comment 2");if(this.advanceCursor(),this.skipSpaces(),e.row!=this.row){const l=Se;return[new V(e,l,"")]}let a="";for(;this.isNotEmpty()&&this.source[this.cursor]!==`
`;)a+=this.source[this.cursor],this.advanceCursor();const o=Se;return[new V(e,o,a)]}if(this.isAlpha(t)){const n=this.cursor;for(;this.isNotEmpty()&&this.isAlphaNumeric(this.source[this.cursor]);)this.advanceCursor();const a=this.source.substring(n,this.cursor);if(a===J)return[new V(e,J,a)];const o=this.isType(a)?X:T;return[new V(e,o,a)]}if(this.isDigit(t)){const n=this.cursor;for(;this.isNotEmpty()&&this.isDigit(this.source[this.cursor]);)this.advanceCursor();const a=this.source.substring(n,this.cursor);return[new V(e,me,a)]}if(t===Oe){const n=this.cursor+1;for(;this.isNotEmpty();)if(this.advanceCursor(),this.source[this.cursor]===Oe){this.advanceCursor();break}const a=this.source.substring(n,this.cursor-1);return[new V(e,se,a)]}return[ze,G,Q,Y,F,pe,st].includes(t)?(this.isNotEmpty()&&this.advanceCursor(),[new V(e,w,t)]):[null,`${e.display()}: invalid token at ${t}`]}tokenize(){const e=[];for(;;){const[t,s]=this.nextToken();if(s)throw new Error(s);if(!t)break;e.push(t)}return[e]}}class at{constructor(e){d(this,"lexer");this.lexer=e}parseTokens(e,t){let s="";switch(t){case"go":s+=`package main

`;break;case"php":s+=`<?php
`}for(;e.length>0;){const r=e[0];switch(r.name){case X:s+=this.parseVariableDeclaration(e,t);break;case T:s+=this.parseFunctionCall(e,t);break;case J:s+=this.parseFunction(e,t,1);break;default:const n=`${r.location.display()}: expected ${X} or ${T}, but got ${r.name}: ${r.value}`;throw new Error(n)}s+=`
`}return s}assertNextTokenName(e,...t){const s=e.shift()??null;if(!s){const r=`expected ${t.join(", ")}, but got null`;throw new Error(r)}if(!t.includes((s==null?void 0:s.name)??"")){const r=`${s.location.display()}: expected ${t.join(", ")}, but got ${s.name}: ${s.value}`;throw new Error(r)}return s}assertNextTokenLiteral(e,t){const s=e.shift()??null;if(!s){const r=`expected ${t}, but got null`;throw new Error(r)}if(s.value!==t){const r=`${s.location.display()}: expected ${t}, but got ${s.value}`;throw new Error(r)}return s}assertString(e,t){if(e!==t){const s=`expected string ${e}, but got ${t}`;throw new Error(s)}}parseVariableDeclaration(e,t){const s=this.assertNextTokenName(e,X),r=this.assertNextTokenName(e,T),n=this.assertNextTokenName(e,w);this.assertString(n.value,ze);let a="";switch(s.value){case je:{const l=this.assertNextTokenName(e,se);switch(t){case"go":a=`var ${r.value} ${s.value} = "${l.value}"`;break;case"php":a=`$${r.value} = (${s.value}) "${l.value}";`;break;default:a=`const ${r.value} = "${l.value}";`;break}break}default:{const l=this.assertNextTokenName(e,me);switch(t){case"go":a=`var ${r.value} ${s.value} = ${l.value}`;break;case"php":a=`$${r.value} = (${s.value}) ${l.value};`;break;default:a=`const ${r.value} = ${l.value};`;break}break}}const o=this.assertNextTokenName(e,w);return this.assertString(o.value,pe),a}parseFunctionCall(e,t){const s=this.assertNextTokenName(e,T),r=this.assertNextTokenName(e,w);this.assertString(r.value,Y);const n=this.assertNextTokenName(e,T,me,se,w);n.name===se&&(n.value=`"${n.value}"`);const a=n.name!==w&&n.value!==F;let o="";if(a){o=n.value;const p=this.assertNextTokenName(e,w);this.assertString(p.value,F)}const l=this.assertNextTokenName(e,w);switch(this.assertString(l.value,pe),s.value){case"print":switch(t){case"go":return`println(${o})`;case"php":return n.name===T?`printf("%s\\n", $${o});`:`printf(${o});`;default:return`console.log(${o});`}default:switch(t){case"go":return`${s.value}(${o})`;case"php":return n.name===T?`${s.value}("%s\\n", $${o});`:`${s.value}(${o});`;default:return`${s.value}(${o});`}}}generateIndent(e){let t="";const s=e*4;for(let r=1;r<=s;r++)t+=" ";return t}parseFunction(e,t,s){const r=this.generateIndent(s-1),n=this.generateIndent(s);let a=this.assertNextTokenName(e,J);a=this.assertNextTokenName(e,T);const o=a.value;this.assertNextTokenLiteral(e,Y),this.assertNextTokenLiteral(e,F),this.assertNextTokenLiteral(e,G);let l="";switch(t){case"go":if(o==="main"){l+=`func ${r}${o}() {
`;break}l+=`${r}${o} := func() {
`;break;default:l+=`${r}function ${o}() {
`;break}for(;e.length>0;){const p=e[0];if(p.value===Q)break;switch(p.name){case X:l+=n+this.parseVariableDeclaration(e,t)+`
`;break;case T:l+=n+this.parseFunctionCall(e,t)+`
`;break;case J:l+=this.parseFunction(e,t,s+1)+`
`;break}}return this.assertNextTokenLiteral(e,Q),l+=`${r}}`,l}}const ot=`
fn main() {
    int num1 = 2;
    print(num1);

    string text = "Hi!";
    print(text);

    fn customPrint() {
        print("called from func");
    }
}
`;function it(i){let e,t,s="MAI Lang",r,n,a,o,l,p,k,x,j="MAI source code",L,_,E,ne,y,A,xe="Go",ae,z,C,oe,I,O,Ee="JS",ie,U,P,le,S,R,$e="PHP",ce,B,D,ue,Te;return{c(){e=N(),t=m("h1"),t.textContent=s,r=N(),n=m("p"),a=ke(i[4]),o=ke(" "),l=N(),p=m("div"),k=m("div"),x=m("label"),x.textContent=j,L=N(),_=m("div"),E=m("textarea"),ne=N(),y=m("div"),A=m("label"),A.textContent=xe,ae=N(),z=m("div"),C=m("textarea"),oe=N(),I=m("div"),O=m("label"),O.textContent=Ee,ie=N(),U=m("div"),P=m("textarea"),le=N(),S=m("div"),R=m("label"),R.textContent=$e,ce=N(),B=m("div"),D=m("textarea"),this.h()},l(f){He("svelte-1eds6rg",document.head).forEach(u),e=b(f),t=v(f,"H1",{"data-svelte-h":!0}),H(t)!=="svelte-1vjs4wv"&&(t.textContent=s),r=b(f),n=v(f,"P",{class:!0});var he=g(n);a=Le(he,i[4]),o=Le(he," "),he.forEach(u),l=b(f),p=v(f,"DIV",{class:!0});var M=g(p);k=v(M,"DIV",{class:!0});var Z=g(k);x=v(Z,"LABEL",{class:!0,for:!0,"data-svelte-h":!0}),H(x)!=="svelte-pcyajw"&&(x.textContent=j),L=b(Z),_=v(Z,"DIV",{class:!0});var _e=g(_);E=v(_e,"TEXTAREA",{class:!0}),g(E).forEach(u),_e.forEach(u),Z.forEach(u),ne=b(M),y=v(M,"DIV",{class:!0});var W=g(y);A=v(W,"LABEL",{class:!0,for:!0,"data-svelte-h":!0}),H(A)!=="svelte-e4uy0f"&&(A.textContent=xe),ae=b(W),z=v(W,"DIV",{class:!0});var Ne=g(z);C=v(Ne,"TEXTAREA",{class:!0}),g(C).forEach(u),Ne.forEach(u),W.forEach(u),oe=b(M),I=v(M,"DIV",{class:!0});var ee=g(I);O=v(ee,"LABEL",{class:!0,for:!0,"data-svelte-h":!0}),H(O)!=="svelte-4v4mau"&&(O.textContent=Ee),ie=b(ee),U=v(ee,"DIV",{class:!0});var be=g(U);P=v(be,"TEXTAREA",{class:!0}),g(P).forEach(u),be.forEach(u),ee.forEach(u),le=b(M),S=v(M,"DIV",{class:!0});var te=g(S);R=v(te,"LABEL",{class:!0,for:!0,"data-svelte-h":!0}),H(R)!=="svelte-1tfbv71"&&(R.textContent=$e),ce=b(te),B=v(te,"DIV",{class:!0});var we=g(B);D=v(we,"TEXTAREA",{class:!0}),g(D).forEach(u),we.forEach(u),te.forEach(u),M.forEach(u),this.h()},h(){document.title="MAI Lang",h(n,"class","has-text-danger svelte-xcim33"),h(x,"class","label"),h(x,"for",""),h(E,"class","textarea svelte-xcim33"),h(_,"class","control"),h(k,"class","field svelte-xcim33"),h(A,"class","label"),h(A,"for",""),h(C,"class","textarea svelte-xcim33"),C.value=i[1],C.readOnly=!0,h(z,"class","control"),h(y,"class","field svelte-xcim33"),h(O,"class","label"),h(O,"for",""),h(P,"class","textarea svelte-xcim33"),P.value=i[2],P.readOnly=!0,h(U,"class","control"),h(I,"class","field svelte-xcim33"),h(R,"class","label"),h(R,"for",""),h(D,"class","textarea svelte-xcim33"),D.value=i[3],D.readOnly=!0,h(B,"class","control"),h(S,"class","field svelte-xcim33"),h(p,"class","langs svelte-xcim33")},m(f,$){K(f,e,$),K(f,t,$),K(f,r,$),K(f,n,$),c(n,a),c(n,o),K(f,l,$),K(f,p,$),c(p,k),c(k,x),c(k,L),c(k,_),c(_,E),ye(E,i[0]),c(p,ne),c(p,y),c(y,A),c(y,ae),c(y,z),c(z,C),c(p,oe),c(p,I),c(I,O),c(I,ie),c(I,U),c(U,P),c(p,le),c(p,S),c(S,R),c(S,ce),c(S,B),c(B,D),ue||(Te=[Ae(E,"input",i[6]),Ae(E,"keyup",i[7])],ue=!0)},p(f,[$]){$&16&&Ge(a,f[4]),$&1&&ye(E,f[0]),$&2&&(C.value=f[1]),$&4&&(P.value=f[2]),$&8&&(D.value=f[3])},i:fe,o:fe,d(f){f&&(u(e),u(t),u(r),u(n),u(l),u(p)),ue=!1,Ye(Te)}}}function lt(i,e,t){let s=ot,r="",n="",a="",o="";function l(){try{t(4,o=""),t(1,r=""),t(2,n=""),t(3,a="");const x="source.mai",j=new nt(x,s),[L,_]=j.tokenize();if(_)throw console.error(_),j.logLineError(),new Error(_);console.log({tokens:L});const E=new at(j);t(1,r=E.parseTokens([...L],"go")),t(2,n=E.parseTokens([...L],"js")),t(3,a=E.parseTokens([...L],"php"))}catch(x){console.error(x),t(4,o=`${x}`)}}De(()=>{t(0,s=s.replace(`
`,"")),l()});function p(){s=this.value,t(0,s)}return[s,r,n,a,o,l,p,()=>l()]}class ct extends de{constructor(e){super(),ge(this,e,lt,it,ve,{})}}function Re(i){let e,t;return e=new ct({}),{c(){Me(e.$$.fragment)},l(s){Ke(e.$$.fragment,s)},m(s,r){Ve(e,s,r),t=!0},i(s){t||(q(e.$$.fragment,s),t=!0)},o(s){re(e.$$.fragment,s),t=!1},d(s){Fe(e,s)}}}function ut(i){let e,t,s=i[0]=="home"&&Re();return{c(){s&&s.c(),e=Ce()},l(r){s&&s.l(r),e=Ce()},m(r,n){s&&s.m(r,n),K(r,e,n),t=!0},p(r,[n]){r[0]=="home"?s?n&1&&q(s,1):(s=Re(),s.c(),q(s,1),s.m(e.parentNode,e)):s&&(Xe(),re(s,1,1,()=>{s=null}),qe())},i(r){t||(q(s),t=!0)},o(r){re(s),t=!1},d(r){r&&u(e),s&&s.d(r)}}}function ht(i,e,t){let s;return De(()=>{Ie.subscribe(o=>{o!=null&&t(0,s=o)});const n=new URLSearchParams(location.search).get("page")??"",a=et(n)?n:"home";Ie.set(a)}),[s]}class ft extends de{constructor(e){super(),ge(this,e,ht,ut,ve,{})}}function pt(i){let e,t,s;return t=new ft({}),{c(){e=m("section"),Me(t.$$.fragment),this.h()},l(r){e=v(r,"SECTION",{class:!0});var n=g(e);Ke(t.$$.fragment,n),n.forEach(u),this.h()},h(){h(e,"class","svelte-u22agc")},m(r,n){K(r,e,n),Ve(t,e,null),s=!0},p:fe,i(r){s||(q(t.$$.fragment,r),s=!0)},o(r){re(t.$$.fragment,r),s=!1},d(r){r&&u(e),Fe(t)}}}class Et extends de{constructor(e){super(),ge(this,e,null,pt,ve,{})}}export{Et as component,xt as universal};
