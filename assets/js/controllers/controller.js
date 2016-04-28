// 定义一个模块, 并引入依赖的angular模块
var umService = angular.module( 'UserManage', [ 'ngRoute' ] );

function umRouteConfig ($routeProvider, $locationProvider) {
	//console.log( $routeProvider );
	$routeProvider
	.when( '/', {
		controller: ListController,
		templateUrl: 'views/list.html'
	})
	.when( '/detail/:id', {
		controller: UpdateController,
		templateUrl: 'views/detail.html'
	})
	.otherwise({
      	redirectTo: '/'
    });
    
	$locationProvider.html5Mode(true);
}

umService.config( umRouteConfig );
umService.controller('MainCtrl', function($scope) {
	$scope.showEdit = true;
	$scope.master = {};
});

function ListController ( $scope, $http ) {
	$http.get( 'server/user.json' ).success( function ( data, status, headers, config ) {
		//console.log( data );
		$scope.users = data;
	});
  	console.log($scope.master);
	$scope.remove = function(index){
		$scope.users.splice(index, 1);
	}
}

function UpdateController ( $scope, $http, $routeParams ) {
	var id = $routeParams.id;
	// var age = $routeParams.age;
	// console.log( id );
	$http.get( 'server/user.json' ).success( function ( data, status, headers, config ) {
		$scope.xiuUser = getObjById( id, data );	
		//console.log( $scope.xiuUser);
	});
}

function getObjById ( id, obj ) {
	var len = obj.length;
	for(var i=0; i<len; i++){
		if( id == obj[i].id ){
			return obj[i];
		}		
	}
	return null;
}
umService.directive("edit",function($document){
  return{
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope,element,attrs,ngModel){
       	element.bind("click",function(){
	       	var id = "txt_name_" +ngModel.$modelValue.id;
	       	scope.$apply(function(){
	         	angular.copy(ngModel.$modelValue,scope.master);
	         	//console.log(scope.master);
	       	})
	       	//console.log(id);
	       	var obj = document.getElementById(id).getElementsByTagName('input');
	       	for(var i =0;i<obj.length;i++){
		    	obj[i].removeAttribute("readOnly");
		    }
	       	scope.$apply(function(){
	         	scope.showEdit = false;
	       	})
      	});
    }
  }
});
umService.directive("update",function($document){
  return{
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope,element,attrs,ngModel){
      	element.bind("click",function(){
         	console.log(scope.master);
	      	console.log(ngModel.$modelValue);
	      	//alert(ngModel.$modelValue.id + " is updated, Update your value here.");
	      	var id = "txt_name_" +ngModel.$modelValue.id;
	       	var obj = document.getElementById(id).getElementsByTagName('input');
	       	for(var i =0;i<obj.length;i++){
		    	obj[i].readOnly=true;
		    }
	     	scope.$apply(function(){
	           scope.showEdit = true;
	    	})
      	})
    }
  }
});
umService.directive("cancel",function($document){
  return{
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope,element,attrs,ngModel){
      	element.bind("click",function(){
         	scope.$apply(function(){
           		//console.log(scope.master);
           		//console.log(ngModel.$modelValue);
           		angular.copy(scope.master,ngModel.$modelValue);
           		//ngModel.$modelValue=angular.copy(scope.master);
           		//scope.master=angular.copy(ngModel.$modelValue);
           		//console.log(scope.master);
           		//console.log(ngModel.$modelValue);
         	});
         	var id = "txt_name_" +ngModel.$modelValue.id;
	   		var obj = document.getElementById(id).getElementsByTagName('input');
	   		for(var i =0;i<obj.length;i++){
		    	obj[i].readOnly=true;
		    }
         	scope.$apply(function(){
           		scope.showEdit = true;
         	})
      	})
    }
  }
});
umService.directive("delete",function($document){
  return{
    restrict:'AE',
    require: 'ngModel',
    link:function(scope, element, attrs,ngModel){
      	element.bind("click",function(){
	        var id = ngModel.$modelValue.id;
	        //alert("delete item where employee id:=" + id);
	        scope.$apply(function(){
	          	for(var i=0; i<scope.users.length; i++){
		            if(scope.users[i].id==id){
		               scope.users.splice(i,1);
		            }
	          	}
	        })
      	})
    }
  }
});
