---
title: "Azure DevOps, unit testing and code coverage with .Net Core"
slug: "azure-devops-unit-testing-and-code-coverage-with-net-core"
publishedAt: "2019-08-27T13:30:00.000Z"
updatedAt: "2020-01-11T06:26:38.000Z"
tags:
  - "devops"
  - "principles"
  - "testing"
featureImage: "__GHOST_URL__/content/images/2020/01/cover_smaller-3.jpg"
type: "post"
---

<p>Unit testing can be very handy when it's set up correctly. The gold standard is to have regular CI builds, usually run after each commit, that executes all tests to confirm that the application still does what it's been designed to do.<!-- more --> It can be tricky to get it all set up so all of the magic just happens and unfortunately that can mean it's never done. Get those tests running and reporting! Future You will thank you. In this post, I will walk through the process of setting up a basic build pipeline with Azure DevOps that executes unit tests and reports on code coverage.</p>
<blockquote>
<p>&quot;The best and most convenient time to set up tests is before you start the project&quot; - <a href="https://azuregems.io/">William Liebenberg</a></p>
</blockquote>
<h2 id="startwithaproject">Start with a project</h2>
<p>First steps are to create a basic project. You can follow these steps, or grab the project from <a href="https://github.com/isonaj/BuildApp">here</a>. This project will be the sample angular web app.</p>
<pre><code class="language-bash">$ mkdir BuildApp.Web
$ cd BuildApp.Web
$ dotnet new angular --no-https    # Create a web application
$ cd ..
$ dotnet new sln                   # Create solution file
$ dotnet sln add BuildApp.Web\BuildApp.Web.csproj
$ dotnet build
$ dotnet run --project BuildApp.Web
</code></pre>
<h2 id="unittestinginvscode">Unit testing in VS Code</h2>
<p>I am going to use xUnit for my tests. Why xUnit? No particular reason. There are a few options. If you don't have a favourite already, just pick one. Any unit testing framework is better than none.</p>
<pre><code class="language-bash">$ mkdir BuildApp.Web.Tests
$ cd BuildApp.Web.Tests
$ dotnet new xunit                 # Create a test project
$ dotnet add reference ..\BuildApp.Web\BuildApp.Web.csproj
$ cd..
$ dotnet sln add BuildApp.Web.Tests\BuildApp.Web.Tests.csproj
$ dotnet test
</code></pre>
<p>Update <code>UnitTest1.cs</code> like so:</p>
<pre><code class="language-csharp">public class UnitTest1
{
  [Fact]
  public void Test1()
  {
    var controller = new SampleDataController();
    var result = controller.WeatherForecasts();

    Assert.Equal(5, result.Count());
  }
}
</code></pre>
<p>And then execute the test:</p>
<pre><code class="language-bash">$ dotnet test

Starting test execution, please wait...

Total tests: 1. Passed: 1. Failed: 0. Skipped: 0.
Test Run Successful.
Test execution time: 1.3171 Seconds
</code></pre>
<p>That's helpful, but we can do better.</p>
<h2 id="codecoveragewithcoverlet">Code coverage with Coverlet</h2>
<p>Coverlet is a great tool that provides code coverage for your unit tests. It's super easy to install and use. Just do:</p>
<pre><code class="language-bash">$ dotnet add package coverlet.msbuild
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
</code></pre>
<h2 id="azuredevopsbuildpipeline">Azure DevOps build pipeline</h2>
<p>Unit tests on a developer machine are one thing, but what if you forget to run them?  That's what continuous integration (CI) is all about. Every time code is pushed to master, it is built and the unit tests are run. If it fails to compile, or the unit tests fail, the whole build fails.</p>
<p>First, we will be generating code coverage results in Cobertura format. We will need to use <a href="https://www.nuget.org/packages/dotnet-reportgenerator-cli/">ReportGenerator</a> to convert this to html and before publishing the results. To do this, add the following to the <code>BuildApp.Web.Tests.csproj</code>:</p>
<pre><code class="language-xml">&lt;ItemGroup&gt;
  &lt;DotNetCliToolReference Include=&quot;dotnet-reportgenerator-cli&quot; Version=&quot;4.2.15&quot; /&gt;
&lt;/ItemGroup&gt;
</code></pre>
<p>Add this to the project as <code>azure-pipelines.yml</code>:</p>
<pre><code class="language-yaml">name: BuildApp-CI

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

- script: dotnet test BuildApp.Web.Tests/BuildApp.Web.Tests.csproj --logger &quot;trx;LogFileName=testresults.trx&quot; /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura /p:CoverletOutput=TestResults/Coverage/
  displayName: 'dotnet test'

- script: dotnet reportgenerator &quot;-reports:$(Build.SourcesDirectory)/TestResults/Coverage/coverage.cobertura.xml&quot; &quot;-targetDir:$(Build.SourcesDirectory)/TestResults/Coverage/Reports&quot; -tag:$(Build.BuildNumber) -reportTypes:htmlInline
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
</code></pre>
<p><img src="/images/ghost/2020/01/testresults.png" alt="Test Results" loading="lazy"><br>
<strong>Figure: Test Results for the single test</strong></p>
<p><img src="/images/ghost/2020/01/codecoverage.png" alt="Code Coverage" loading="lazy"><br>
<strong>Figure: Code Coverage Results</strong></p>
<h2 id="sonarqube">SonarQube</h2>
<p><a href="https://www.sonarqube.io/">SonarQube</a> is a static analysis tool that will:</p>
<ul>
<li>highlight bugs and vulnerabilities</li>
<li>review security hotspots</li>
<li>track technical debt</li>
<li>provide code quality metrics</li>
<li>integrate with CI/CD</li>
<li><em>and that's just in the community edition!</em></li>
</ul>
<p>Let's hook it up.</p>
<ol>
<li>Sign up at sonarqube.io and create your project. Use the new Auto Scan feature.</li>
<li>Drop a .sonarcloud.properties file into the root folder of your project.</li>
<li>Commit and push. This will trigger the first analysis run.</li>
</ol>
<p>Some of the results you can get from SonarQube are:<br>
<img src="/images/ghost/2020/01/sonarqube_overview.png" alt="SonarQube Overview" loading="lazy"><br>
<strong>Figure: SonarQube overview</strong></p>
<p><img src="/images/ghost/2020/01/sonarqube_issues.png" alt="SonarQube Issues" loading="lazy"><br>
<strong>Figure: SonarQube review results</strong></p>
<p><img src="/images/ghost/2020/01/sonarqube_projects.png" alt="SonarQube Project Summary" loading="lazy"><br>
<strong>Figure: SonarQube project summary</strong></p>
<p>SonarQube looks like a great addition to any project. If you're worried about giving them access to your codebase, they also have local server options that can generate reports without handing over access.</p>
<p>Running unit tests during your build process really helps to keep your code doing what it is designed to do. There are also many static analysis tools that can automatically scan for security vulnerabilities and best practices. By applying these tools automatically in your CI/CD pipeline, you can deploy with confidence.</p>
<p><strong>References:</strong></p>
<ul>
<li><a href="https://www.hanselman.com/blog/AutomaticUnitTestingInNETCorePlusCodeCoverageInVisualStudioCode.aspx">https://www.hanselman.com/blog/AutomaticUnitTestingInNETCorePlusCodeCoverageInVisualStudioCode.aspx</a></li>
<li><a href="https://medium.com/bluekiri/code-coverage-in-vsts-with-xunit-coverlet-and-reportgenerator-be2a64cd9c2f">https://medium.com/bluekiri/code-coverage-in-vsts-with-xunit-coverlet-and-reportgenerator-be2a64cd9c2f</a></li>
<li><a href="https://dev.to/deinsoftware/net-core-unit-test-and-code-coverage-with-visual-studio-code-37bp">https://dev.to/deinsoftware/net-core-unit-test-and-code-coverage-with-visual-studio-code-37bp</a></li>
</ul>
