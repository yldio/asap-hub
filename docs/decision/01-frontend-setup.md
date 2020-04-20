# Frontend setup

Status: Final

Date: 2020-04-14

Author: Tim Seckinger <tim.seckinger@yld.io>

Reviewed-by: Filipe Pinheiro <filipe@yld.io>

## Context

One of the components of the ASAP Hub is a Web Application. We expect many dynamic elements in that web application, so we want to use a web framework to give structure to the application code and easily cope with the arising complexities. YLD as a consultancy company is most familiar with React, which has overall been an immensely popular choice in recent years. Using React as opposed to other options will reduce the learning curve significantly.

We need to decide in what way we want to use React to render the user interface, and whether we want to use further tools around it that fundamentally influence the technical project setup.

## Options

We considered the following options:

1. Single-page application (SPA)
1. using [create-react-app](https://github.com/facebook/create-react-app) (CRA)
1. using [Next.js](https://github.com/zeit/next.js)
1. Static site
1. Universally rendered SPA

### Single-page application

This is a very safe choice as it’s how many React applications have been written for quite some time. However, it can prove difficult to provide a very quick initial page load on slow devices (old or low-end phones) and on slow/unstable internet connections (2G or bad 3G/4G). It also requires JavaScript execution to be enabled in the browser (which it is by default on all popular browsers).

#### using CRA

The tool create-react-app (CRA) can make this kind of app very quick to set up and to keep up-to-date. As long as we do not have highly specific technical requirements, we can use the open source solution to avoid taking away time for maintaining a custom one from developing core features for the project.

#### using Next.js

The framework Next.js (which is suggested for option 3) can alternatively also be used to bootstrap a plain client-side rendering SPA. However, generally there are more mature choices for tackling SPA challenges (such as react-router vs. the Next.js router, the create-react-app bundling and developer tooling vs the Next bundling and development server).

### Static site

A static site takes source files and generates assets to be served without further processing on the server. A static site potentially reduces infrastructure complexity and support.

We expect mainly views that are rendered for one particular user. This means that what we could render statically would basically just be a shell of the site; everything else would still have to be fetched and rendered dynamically after the initial load of the page.

This means that setting up static rendering would be unnecessary complexity, especially given that any quickly loading app shell would be easier to set up and faster to appear using Progressive Web App (PWA) offline storage techniques.

### Universally rendered SPA

Universal (server-side and client-side) rendering is capable of doing for us what a static site misses: Rendering views for a particular user, while still delivering the fully populated page straight to the user without the need to fetch and populate after the initial load.

However, it is not clear we urgently need the performance characteristics that server-side rendering (SSR) provides for our users. On stable internet connections, shipping a well-optimized SPA to the browser and then having it load and render the page can suffice.

It is worth noting that writing universal code everywhere does require extra effort, and frameworks do not solve all aspects of it, like consistently calculating URLs and fetching data across environments. Even the most common such framework Next.js is also not as mature as React itself (example: https://github.com/zeit/next.js/issues/8207).

## Decision

**We will set up the frontend as a single-page application (1).**  
There is not enough static content to give value to a static site (2).  
Server-rendering (3) does not provide enough value for our use cases to warrant the complexity it introduces.

**We will use create-react-app (1.1) to set up the frontend.**  
Next.js (1.2) has its strength around server rendering.
