ligApp.controller('indexController', function indexController($scope, $http) {
	$scope.epochTime = new Date(Date.UTC(2016, 4, 24, 17, 0, 0, 0)).getTime();
    $scope.income = []
    $scope.outcome = []
    $scope.projects = [];
    $scope.contributions = [];
    $scope.initiatives = [];
    $scope.authors = {};
    $scope.events = [];
    $scope.lignode = "liskwallet.punkrock.me";
    $scope.fulig = {
        address: '13861531827625059307L',
        balance: null
    };

    $http.get ('https://' + $scope.lignode + '/api/accounts/getBalance?address=' + $scope.fulig.address).then (function (data) {
        $scope.fulig.balance = parseInt (data.data.balance) / 100000000;
    });
    $http.get('https://' + $scope.lignode + '/api/transactions?limit=15&recipientId=' + $scope.fulig.address).then(function (data) {
        var tempIncome = data.data.transactions;

        tempIncome.forEach(function (e) {
            $http.get('https://' + $scope.lignode + '/api/accounts/getPublicKey?address=' + e.senderId).then(function (data) {
                if (data.status === 200) {
                    $http.get('https://' + $scope.lignode + '/api/delegates/get?publicKey=' + data.data.publicKey).then(function (data) {
                        if (data.data.success && data.status === 200) {
                            e.delegate = data.data.delegate.username;
                        }
                    });
                }
            });
            if (e.amount !== 0 && $scope.income.length < 5)
                $scope.income.push(e);
        }, this);
    })
    
    $http.get ('data/outcomes.json').then (function (outdict) {
    	outdict = outdict.data;
    	
		$http.get('https://' + $scope.lignode + '/api/transactions?limit=15&senderId=' + $scope.fulig.address).then(function (data) {
		    var tempOutcome = data.data.transactions;

		    tempOutcome.forEach(function (e) {
		    	if (e.id in outdict)
		    		e.description = outdict[e.id].description;
		    		
		    	e.timestamp = parseInt (e.timestamp) * 1000 + $scope.epochTime;
		    		
		        $http.get('https://' + $scope.lignode + '/api/accounts/getPublicKey?address=' + e.recipientId).then(function (data) {
		            if (data.data.success && data.status === 200) {
		                $http.get('https://' + $scope.lignode + '/api/delegates/get?publicKey=' + data.data.publicKey).then(function (data) {
		                    if (data.data.success && data.status === 200) {
		                        e.delegate = data.data.delegate.username;
		                    }
		                });
		            }
		        });
                if (e.amount !== 0 && $scope.outcome.length < 5)
    		        $scope.outcome.push(e);
		    }, this);
		});
	});
	
    $http.get ('data/projects.json').then (function (data) {
        $scope.projects = data.data;
    });

    $http.get ('data/events.json').then (function (data) {
        $scope.events = data.data;
    });

    $http.get ('data/initiatives.json').then (function (data) {
        $scope.initiatives = data.data;
    });

    $http.get ('data/contributions.json').then (function (data) {
        $scope.contributions = data.data;
    });

    $http.get ('data/members.json').then (function (data) {
        $scope.members = data.data;
    });
    
    $scope.outcomeDetails = function (o) {
    	$scope.selectedOutcome = o;
    	$('#outcomeDetailsModal').modal ('show');
    };
});
