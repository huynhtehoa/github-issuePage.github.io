import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RenderPagination from "./components/pagination";
import Search from "./components/search";
import Createissue from "./components/createissue";
import IssueCard from "./components/issuecard";
import RenderNavbar from "./components/navbar";
import RenderNavSearchResult from "./components/navsearchresult"
import RenderFooter from "./components/footer";
import "./css/App.css";

class githubIssue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchRepoName: "",
      searchUserName: "",
      issueList: [],
      isSearch: false,
      currentPage: 1,
      lastPage: 1,
    };
  }

  searchRepoInput = e => {
    this.setState({ searchRepoName: e.target.value });
  };

  searchUserNameInput = e => {
    this.setState({ searchUserName: e.target.value });
  };

  handleClick = async () => {
    const { searchRepoName, searchUserName, currentPage } = this.state;

    if (searchRepoName === '' && searchUserName === '') {
      return alert("Please input a valid username or repository")
    }

    let rawString1;

    let response = await fetch(
      `http://api.github.com/repos/${searchUserName}/${searchRepoName}/issues?page=1`
    );

    let jsonData = await response.json();

    if (jsonData.message !== "Not Found") {

      if (jsonData.length === 0) {
        this.setState.state({
          searchRepoName: "",
          searchUserName: "",
        })
        return alert("This repository has no issues")
      }

      rawString1 = response.headers.get("link")

      if (rawString1 === null) {
        this.setState({
          issueList: jsonData,
          lastPage: 1,
          isSearch: true,
        })

      } else if (rawString1 !== null) {
        let rawString2 = rawString1.substr(rawString1.length - 20, rawString1.legnth)
        let rawString3 = rawString2.replace('>; rel="last"', "")
        let rawString4 = rawString3.replace('page=', "")

        this.setState({
          issueList: jsonData,
          lastPage: parseInt(rawString4),
          isSearch: true
        });
      }
    }

    if (jsonData.message === "Not Found") {
      response = await fetch(
        `https://api.github.com/search/issues?q=${searchUserName}/${searchRepoName}&page=1`
      );
      jsonData = await response.json();

      rawString1 = response.headers.get("link")

      if (rawString1 === null && jsonData.total_count !== 0) {
        this.setState({
          issueList: jsonData.items,
          lastPage: 1,
          currentPage: 1,
          isSearch: true,
        })

      } else if (rawString1 === null && jsonData.total_count === 0) {
        this.setState({
          searchRepoName: "",
          searchUserName: "",
        })
        return alert("Please input a valid username and/or repository")

      } else {
        let rawString2 = rawString1.substr(rawString1.length - 20, rawString1.legnth)
        let rawString3 = rawString2.replace('>; rel="last"', "")
        let rawString4 = rawString3.replace('page=', "")

        this.setState({
          issueList: jsonData.items,
          lastPage: parseInt(rawString4),
          currentPage: 1,
          isSearch: true
        });
      }
    }
  };

  handleClickForPagination = async () => {
    const { searchRepoName, searchUserName, currentPage } = this.state;

    let response = await fetch(
      `http://api.github.com/repos/${searchUserName}/${searchRepoName}/issues?page=${currentPage}`
    );

    let jsonData = await response.json();

    if (jsonData.message !== "Not Found") {
      this.setState({
        issueList: jsonData,
      });
    }

    if (jsonData.message === "Not Found") {
      response = await fetch(
        `https://api.github.com/search/issues?q=${searchUserName}/${searchRepoName}&page=${currentPage}`
      );
      jsonData = await response.json();

      this.setState({
        issueList: jsonData.items,
      });
    }
  }

  handlePageChange = (page, e) => {
    this.handleClickForPagination()
    this.setState({
      currentPage: page,
    });
  };

  henryFunctionToPushObjToArray = obj => {
    let tempArr = [];
    tempArr.unshift(obj);
    this.setState({
      issueList: tempArr.concat(this.state.issueList),
      isSearch: true,
    });
  };

  render() {
    if (!this.state.isSearch) {
      return (
        <div className="App">
          <RenderNavbar />
          <div className="App-header container">
            <h1 className="text-uppercase">Github issue page</h1>
            <Search
              handleClick={this.handleClick}
              searchRepoInput={e => this.searchRepoInput(e)}
              searchUserNameInput={e => this.searchUserNameInput(e)}
              searchUserName={this.state.searchUserName}
              searchRepoName={this.state.searchRepoName}
            />
          </div>
          <div className="App-footer">
            <RenderFooter />
          </div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <div style={{ height: "4rem" }}>
            <RenderNavSearchResult
              handleClick={this.handleClick}
              searchRepoInput={e => this.searchRepoInput(e)}
              searchUserNameInput={e => this.searchUserNameInput(e)}
              searchUserName={this.state.searchUserName}
              searchRepoName={this.state.searchRepoName}
            />

          </div>
          <div className="App-body container">
            <div className="row d-flex justify-content-center" style={{ margin: "2rem 0" }}>
              <Createissue getObj={obj => this.henryFunctionToPushObjToArray(obj)} getIssue={this.state.issueList} />
            </div>
            <div className="row d-flex justify-content-center">
              <div style={{ width: "100%" }}>
                <IssueCard issue={this.state.issueList} />
              </div>
            </div>
            <div className="row justify-content-center" style={{ margin: "2rem 0" }}>
              <RenderPagination
                currentPage={this.state.currentPage}
                issue={this.props.issueList}
                lastPage={this.state.lastPage}
                onPageChange={(page) => this.handlePageChange(page)}
              />
            </div>
          </div>
          <div className="App-footer">
            <RenderFooter />
          </div>
        </div >
      )
    }
  }
}

export default githubIssue;
