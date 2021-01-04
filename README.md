# AI_Trademark-Frontend

# How to run this project

This project is separated into 3 sections:

- Angular Frontend
- ExpressJS Backend
- ExpressJS Backend (written in Typescript)

The ExpressJS Backend will be eventually migrated to Typescript once everything is done.

## General prerequisites

- [NodeJS@latest](https://nodejs.org/en/download/current/) (Currently using Node v15.5.0)

These project uses the Angular CLI and the typpescript language. As such, you may install the global dependancies as such:

```
npm install -g @angular/cli typescript nodemon
```

For lazy people, this little snippet will install all required dependencies in all sub-components:

```
npm install -g @angular/cli typescript nodemon
cd public
npm install --include-dev
cd ../app
npm install --include-dev
cd ../app-socketAB
npm install --include-dev
```

Then to run, open these in **separate terminals**:

### Terminal #1

```
cd public
ng serve
```

### Termial #2

```
cd app
nodemon ./app.js
```

### Termial #3

```
cd app-socketAB
npm run devStart
```

---

## Setting up and Running the Angular Project

1. Get into the project folder, then the Angular project folder

```
cd public
```

2. Install all required developer dependancies

```
npm install --include-dev
```

3. After installing, you may run the project via the following command. Take note that the first run will generally take about 15 seconds:

```
ng serve
```
