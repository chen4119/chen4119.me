---
headline: 2 common gotchas in React
description: Some description
author:
    "@id": _:jsonld/me.yml
dateCreated: 2019-09-06
keywords: ["react", "javascript"]
language: jsx
id: two-common-gotchas-in-react
year: 2019
---

React may have a reputation as an easy UI library to learn but it also has some really easy ways to shoot yourself in the foot.  Here are some common ones you will undoubtedly face in your React app and potential solutions

__1. Using .bind or arrow function when passing a function as a prop__

Passing a function as a prop to a component is very common in React.

    class Component1 extends React.Component {
        constructor() {
            this.state = {
                value: ''
            };
        }

        handleClick(e) {
            this.setState({value: e.target.value});
        }

        render() {
            return (
                <ChildComponent onClick={this.handleClick} />
            );
        }
    }

The problem with the code above is that "this" in handleClick is not binded to Component1 so when you run it, you'll get "cannot read property 'setState' of undefined" error message.  There are two easy ways to fix this.  You can bind handleClick to "this" or inline handleClick as an anonymous function.

    render() {
        return (
            <ChildComponent onClick={this.handleClick.bind(this)} />
        );
    }

    render() {
        return (
            <ChildComponent onClick={() => this.setState({value: e.target.value})} />
        );
    }

Your code will work as expected now, BUT, what you need to be aware of with both methods above is that on every render, a new instance of the function is passed to ChildComponent.  Bind returns a COPY of the given function and arrow function declaration create a new function every time.  This is probably not what you are intending and the side effect is, if ChildComponent is a pure component, it will cause ChildComponent to re-render every time since it's prop changed.

To make sure you are not creating a new function on every render, you can bind handleClick to "this" in the constructor.

    class Component1 extends React.Component {
        constructor() {
            this.state = {
                value: ''
            };
            this.handleClick = this.handleClick.bind(this);
        }

        handleClick(e) {
            this.setState({value: e.target.value});
        }

        render() {
            return (
                <ChildComponent onClick={this.handleClick} />
            );
        }
    }


__2. Calling setState after component has unmounted__

To fetch some data to populate your React component, you might do this.

    class BlogComponent extends React.Component {
        constructor() {
            this.state = {
                blog: null
            };
        }

        componentdidMount() {
            this.getBlogPost();
        }

        async getBlogPost() {
            const result = await fetch("http://example.com/blog/post1");
            const blog = await result.json();
            this.setState({blog: blog});
        }

        render() {
            const {blog} = this.state;
            // render blog
        }
    }

Pretty standard, on component mount, you fetch your blogpost, set the state which triggers a render of your blogpost.  The problem is if the user decide to navigate away from this page and therefore unmount BlogComponent before fetch completes, calling this.setState after the component unmounted will cause this warning message from React.

> Warning: Can’t call setState (or forceUpdate) on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.

An easy fix would be to have an isUnmounted flag and check this flag before calling this.setState like so

    class BlogComponent extends React.Component {
        constructor() {
            this.state = {
                blog: null
            };
            this.isUnmounted = false;
        }

        componentdidMount() {
            this.getBlogPost();
        }

        componentWillUnmount() {
            this.isUnmounted = true;
        }

        async getBlogPost() {
            const result = await fetch("http://example.com/blog/post1");
            const blog = await result.json();
            if (!this.isUnmounted) {
                this.setState({blog: blog});
            }
        }

        render() {
            const {blog} = this.state;
            // render blog
        }
    }

But you really don't want to be doing this check every time you call setState after an async call.  Your code will quickly become hard to maintain.  A better solution would be to wrap your fetch in another function that can be used throughout your app that checks if a component has been unmounted and if so, throw an exception.

    async function getData(path, options, flag = {isUnmounted: false}) {
        const result = await fetch(path, options);
        const json = await result.json();
        if (flag.isUnmounted) {
            throw new Exception('unmounted error');
        }
        return json;
    }

In your component, you can now use getData whenever you need to fetch data.  Flag is optional so if you don't pass in a flag, getData will still work as expected.  It's always a good practice to wrap your getData inside a try catch block so if getData throws an exception, this.setState will not be called.  

    class BlogComponent extends React.Component {
        constructor() {
            this.state = {
                blog: null
            };
            this.flag = {isUnmounted: false};
        }

        componentdidMount() {
            this.getBlogPost();
        }

        componentWillUnmount() {
            this.flag = {isUnmounted: true};
        }

        async getBlogPost() {
            try {
                const blog = await getData("http://example.com/blog/post1", {}, this.flag);
                this.setState({blog: blog});
            } catch (e) {
                // handle error 
            }
        }

        render() {
            const {blog} = this.state;
            // render blog
        }
    }





