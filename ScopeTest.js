
function ScopeTest() {
}

ScopeTest.prototype = {
    "t" : function() {
       console.log("TTTTTTTTTTTTTTTTT");
    },
    "r" : function() {
       this.t();
    }
}

var st = new ScopeTest();
st.t();
st.r();