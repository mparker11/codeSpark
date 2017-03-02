'use strict';

angular.module('codeSpark.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeController'
    });
}])

.controller('HomeController', ['$scope', '$routeParams', function($scope, $routeParams) {
    //get students data
    $scope.students = [];
    const getStudents = firebase.database().ref('students').once('value').then(function(snapshot) {
        snapshot.forEach(function(studentSnap) {
            let student = studentSnap.val();
            student['student_id'] = studentSnap.key;
            $scope.students.push(student);
            $scope.$apply();
        });
    });
    
    //get the grades for all tests
    $scope.allTests = [];
    const getTests = firebase.database().ref('tests').once('value').then(function(snapshot) {
        snapshot.forEach(function(testSnap) {
            let test = testSnap.val();
            $scope.allTests.push(test);
            $scope.$apply();
        });
    });
    
    //wait until we get all the data
    Promise.all([getStudents, getTests]).then(() => {
        /*console.log(students);*/
        console.log($scope.allTests);
        
        //calculate average per student
        for (let i = 0; i < $scope.students.length; i++) {
            let studentID = $scope.students[i]['student_id'];
            let studentTotal = 0;
            let numOfTests = 0;
            
            for (let k = 0; k < $scope.allTests.length; k++) {
                if ($scope.allTests[k].grades[studentID] !== undefined) {
                    studentTotal += parseInt($scope.allTests[k].grades[studentID]);
                    numOfTests++;
                }
            }
            
            $scope.students[i]['test_avg'] = Math.round(studentTotal / numOfTests);
        }
        
        
        //calculate average per test
        for (let w = 0; w < $scope.allTests.length; w++) {
            let testTotal = 0;
            let numOfGrades = Object.keys($scope.allTests[w].grades).length;
            
            for(let grade in $scope.allTests[w].grades) {
                testTotal += parseInt($scope.allTests[w].grades[grade]);
            }
            
            $scope.allTests[w]['test_avg'] = Math.round(testTotal / numOfGrades);
            $scope.allTests[w]['date'] = moment($scope.allTests[w]['date']).format('MMMM DD');
        }
        
        $scope.$apply();
    });
}]);