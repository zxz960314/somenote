'use strict';
var server="http://www.somenote.cn:1510"
/**
 * @ngdoc overview
 * @name somenoteApp
 * @description
 * # somenoteApp
 *
 * Main module of the application.
 */
angular
  .module('a', ["ui.router","ngCookies"]).config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider){
    $urlRouterProvider.when('',"/denglu"),
  	$stateProvider.state("b",{
  		templateUrl:"views/denglu.html",
        url:"/denglu",
  	}).state("c",{
		templateUrl:"views/zhuce.html",
		url:"/zhuce"
  }).state("zu",{
		templateUrl:"views/zhuyaoneirong.html",
		url:"/neirong"
  }).state("j",{
		templateUrl:"views/zengjia.html",
		url:"/jia"
  })
 }]).controller("zhuce",["$scope","$http",function ($scope,$http) {
  			$scope.zhuce=function(){
          		$http({
					url:server+"/users",
					method:"POST",
					data:$scope.updata				
				}).success(function(){
					alert("注册成功"),
					window.location.href="#denglu"
			}).error(function(){
				alert("注册失败"),
				$scope.updata=null
			}) 		
  		} 
  }]).controller("denglu",["$scope","$http","$cookieStore","$cookies",function ($scope,$http,$cookieStore,$cookies) {
			if(($cookies.get('username',$scope.updata))&&($cookies.get('password',$scope.updata))){

			window.location.href="#neirong"
		}
		$scope.denglu=function(e){
         	$http({
					url:server+"/users/login",
					method:"POST",				
					data:$scope.updata
				}).success(function(e){
					alert("登陆成功");
					$cookieStore.put("zxz",e.uid);
				if($scope.qt==true){
						$cookieStore.put("username",$scope.updata);
						$cookieStore.put("password",$scope.updata);
						var expireDate = new Date();
  						expireDate.setDate(expireDate.getDate() + 1);
  						$cookies.put('username', $scope.updata, {'expires': expireDate});
						$cookies.put('password', $scope.updata, {'expires': expireDate})
			}

			
			window.location.href="#neirong"

			}).error(function(){
				alert("登录失败"),
				$scope.updata=null
			})
  		}
  }]).controller("neirong",["$scope","$http","$cookieStore","$cookies",function ($scope,$http,$cookieStore,$cookies) {
  	$scope.uid=$cookieStore.get('zxz')
  	var a=0
  	$http({
		url:server+"/item",
		method:"get",
		params:{"$skip":a,"$limit":5,"uid":$scope.uid}
	}).success(function(e){
		$scope.data=e
	})
  		$scope.shanchu=function(e){
 		$http({
 			url:server+"/item/"+e.id,
			method:"delete"
		}).success(function(e){
			$scope.data.splice($scope.data.indexOf(e),1),
			window.location.reload()

		})
	}
  
	$scope.bianji= function(e) {
	$scope.show=true;
	 $scope.updata=e
	  }
	$scope.querenxiugai= function(e) {

 		$http({
 			url:server+"/item",
			method:"PUT",
			data:$scope.updata,
			withCredentials:true
		}).success(function(){
			$scope.show=false;
			window.location.reload()
		})
	}

	$scope.shang= function() {
		a-=5
		if(a<=0){
			a=0
		}
		$http({
		url:server+"/item",
		method:"get",
		params:{"$skip":a,"$limit":5,"uid":$scope.uid}
	}).success(function(e){
		$scope.data=e
	})
	}


	$scope.xia= function() {

		a+=5
		$http({
		url:server+"/item",
		method:"get",
		params:{"$skip":a,"$limit":5,"uid":$scope.uid}
	}).success(function(e){
		$scope.data=e
		if(e.length<=0){
			alert("已经没有了")
			window.location.reload()
		}
			
		
	})
	}	

	$scope.tui=function(){
		$http({
		url:server+"/users/logout",
		method:"post"
		}).success(function(){
			alert("退出登录")
			$cookieStore.remove("username")
			$cookieStore.remove("password")
			window.location.href="#denglu"
		})
	}
 
  }]).controller("jia",["$scope","$http","$cookieStore","$cookies",function ($scope,$http,$cookieStore,$cookies) {
  		 $scope.updata={"uid":$cookieStore.get('zxz')}
  		$scope.xinzeng=function(){
  			$http({
			url:server+"/item",
			method:"POST",
			data:$scope.updata,
		}).success(function(){
			window.location.href="#neirong",
			$scope.data.push($scope.updata)
			
		})
  	  }
  }])
