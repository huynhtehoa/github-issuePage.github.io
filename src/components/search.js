import React, { Component } from 'react';
import { 
    Button ,
    Navbar,
    Form,
    FormControl,
    } 
from 'react-bootstrap';

class Search extends Component {
    keyPress = (e) => {
        if(e.charCode === 13){
        this.props.handleClick()
    }
    }
    render() {
        return (
        <Navbar bg="dark" variant="dark">
            <Form value="Send Request" inline>
                <FormControl 
                onChange={(e) => this.props.searchUserNameInput(e)} 
                value={this.props.searchUserName} 
                type="text" placeholder="Search Username..." 
                className="mx-sm-2 mx-auto mt-2 mt-md-0"
                onKeyPress={this.keyPress} />
                
                <FormControl 
                onChange={(e) => this.props.searchRepoInput(e)} 
                value={this.props.searchRepoName} 
                type="text" placeholder="Search Repository..." 
                className="mx-sm-2 mx-auto mt-2 mt-md-0"
                onKeyPress={this.keyPress} />
                
                <Button 
                onClick={() => this.props.handleClick()} 
                variant="outline-info"
                className="mx-auto mt-2 mt-md-0"
                > Search
                </Button>
            </Form>
        </Navbar>
        )
    }

}

export default Search;