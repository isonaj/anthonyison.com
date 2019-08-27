---
title: 'Azure DevOps, unit testing and code coverage with .Net Core'
tags:
  - devops
  - testing
  - principles
image: /azure-devops-unit-testing-and-code-coverage-with-dotnet-core/small_cover.jpg
feature_img: cover.jpg
date: 2019-08-27 23:30:58
description:
keywords:
---

Unit testing can be very handy when it's set up correctly. The gold standard is to have regular CI builds, usually run after each commit, that executes all impacted unit tests to confirm that the application still does what it's been designed to do. It can be tricky to get it all set up so that all of the magic just happens and unfortunately that can mean that it's never done. Get those tests running and reporting! Future You will thank you. In this post, I will walk through the process of setting up a basic build pipeline with Azure DevOps that executes unit tests and reports on code coverage.

> "The best and most convenient time to set up tests is before you start the project" - [William Liebenberg](https://azuregems.io/)

## Start with a project
First steps are to create a basic project. You can follow these steps, or grab the project from [here](https://github.com/isonaj/BuildApp). This project will be the sample angular web app.
```bash
$ mkdir BuildApp.Web
$ cd BuildApp.Web
$ dotnet new angular --no-https    # Create a web application
$ cd ..
$ dotnet new sln                   # Create solution file
$ dotnet sln add BuildApp.Web\BuildApp.Web.csproj
$ dotnet build
$ dotnet run --project BuildApp.Web
```

## Unit testing in VS Code
I am going to use xUnit for my tests. Why xUnit? No particular reason. There are a few options. If you don't have a favourite already, just pick one. Any unit testing framework is better than none.

```bash
$ mkdir BuildApp.Web.Tests
$ cd BuildApp.Web.Tests
$ dotnet new xunit                 # Create a test project
$ dotnet add reference ..\BuildApp.Web\BuildApp.Web.csproj
$ cd..
$ dotnet sln add BuildApp.Web.Tests\BuildApp.Web.Tests.csproj
$ dotnet test
```

Update `UnitTest1.cs` like so:
```csharp
public class UnitTest1
{
  [Fact]
  public void Test1()
  {
    var controller = new SampleDataController();
    var result = controller.WeatherForecasts();

    Assert.Equal(5, result.Count());
  }
}
```

And then execute the test:
```bash
$ dotnet test

Starting test execution, please wait...

Total tests: 1. Passed: 1. Failed: 0. Skipped: 0.
Test Run Successful.
Test execution time: 1.3171 Seconds
```

That's helpful, but we can do better.

## Code coverage with Coverlet
Coverlet is a great tool that provides code coverage for your unit tests. It's super easy to install and use. Just do:
```bash
$ dotnet add package coverlet.msbuild
$ dotnet test /p:CollectCoverage=true

Starting test execution, please wait...

Total tests: 1. Passed: 1. Failed: 0. Skipped: 0.
Test Run Successful.
Test execution time: 1.3743 Seconds

Calculating coverage result...
  Generating report 'C:\Projects\BuildApp\BuildApp.Web.Tests\coverage.json'

+--------------------+--------+--------+--------+
| Module             | Line   | Branch | Method |
+--------------------+--------+--------+--------+
| BuildApp.Web       | 22.85% | 0%     | 33.33% |
+--------------------+--------+--------+--------+
| BuildApp.Web.Views | 0%     | 100%   | 0%     |
+--------------------+--------+--------+--------+

+---------+---------+--------+---------+
|         | Line    | Branch | Method  |
+---------+---------+--------+---------+
| Total   | 21.33%  | 0%     | 31.25%  |
+---------+---------+--------+---------+
| Average | 10.665% | 0%     | 15.625% |
+---------+---------+--------+---------+
```

## Azure DevOps build pipeline
Unit tests on a developer machine are one thing, but what if you forget to run them?  That's what continuous integration (CI) is all about. Every time code is pushed to master, it is built and the unit tests are run. If it fails to compile, or the unit tests fail, the whole build fails.

First, we will be generating code coverage results in Cobertura format. We will need to use [ReportGenerator](https://www.nuget.org/packages/dotnet-reportgenerator-cli/) to convert this to html and before publishing the results. To do this, add the following to the `BuildApp.Web.Tests.csproj`:
```xml
<ItemGroup>
  <DotNetCliToolReference Include="dotnet-reportgenerator-cli" Version="4.2.15" />
</ItemGroup>
```

Add this to the project as `azure-pipelines.yml`:
```yaml
name: BuildApp-CI

trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

steps:
- task: DotNetCoreInstaller@0
  displayName: 'Install .net core 3.0 (preview)'
  inputs:
    version: '3.0.100-preview6-012264'

- script: dotnet build --configuration $(buildConfiguration)
  displayName: 'dotnet build $(buildConfiguration)'

- script: dotnet test BuildApp.Web.Tests/BuildApp.Web.Tests.csproj --logger "trx;LogFileName=testresults.trx" /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura /p:CoverletOutput=TestResults/Coverage/
  displayName: 'dotnet test'

- script: dotnet reportgenerator "-reports:$(Build.SourcesDirectory)/TestResults/Coverage/coverage.cobertura.xml" "-targetDir:$(Build.SourcesDirectory)/TestResults/Coverage/Reports" -tag:$(Build.BuildNumber) -reportTypes:htmlInline
  workingDirectory: $(Build.SourcesDirectory)/BuildApp.Web.Tests
  displayName: 'dotnet reportgenerator'

- task: PublishTestResults@2
  inputs:
    testRunner: VSTest
    testResultsFiles: '**/*.trx'
    failTaskOnFailedTests: true

- task: PublishCodeCoverageResults@1
  inputs:
    codeCoverageTool: 'cobertura'
    summaryFileLocation: $(Build.SourcesDirectory)/TestResults/Coverage/**/coverage.cobertura.xml
    reportDirectory: $(Build.SourcesDirectory)/TestResults/Coverage/Reports
    failIfCoverageEmpty: false 
```
![Test Results](./testresults.png)
**Figure: Test Results for the single test**

![Code Coverage](./codecoverage.png)
**Figure: Code Coverage Results**

**References:**
* https://www.hanselman.com/blog/AutomaticUnitTestingInNETCorePlusCodeCoverageInVisualStudioCode.aspx
* https://medium.com/bluekiri/code-coverage-in-vsts-with-xunit-coverlet-and-reportgenerator-be2a64cd9c2f
* https://dev.to/deinsoftware/net-core-unit-test-and-code-coverage-with-visual-studio-code-37bp
