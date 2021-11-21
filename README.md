# Yet Another Middleware for Redux

This is redux middleware that may listen to both specific actions and state changes.

## Installation

### via npm

```bash
npm i yet-another-middleware
```

### via yarn

```bash
yarn add yet-another-middleware
```

## Usage

### Middleware creation

```ts
import { createYam } from 'yet-another-middleware';

const yam = createYam([handleOneThing, handleAnotherThing]);

const yamWithContext = createYam([handleOneThing, handleAnotherThing], context);
```

You shouldn't pass any generic arguments to the `createYam`: with properly typed handlers TS will derive them automagically.

### Handler creation

By default, handlers listen to every action:

```ts
import type { HandlerArg } from 'yet-another-middleware';

function handleSomething(arg: HandlerArg<State, Context>) {
  // handles every action
}
```

#### Handle an action

You may add conditions to run some logic only for a specific action:

```ts
import type { HandlerArg } from 'yet-another-middleware';

function handleAction({ action }: HandlerArg<State, Context>) {
  if (action.type === 'typeYouWantToHandle') {
    // handle the action with type you want
  }
}
```

But the better option is to use `createYamHandler` function provided by the library:

```ts
import { createAction } from '@reduxjs/toolkit';
import { createYamHandler } from 'yet-another-middleware';

const actionYouHandle = createAction('typeYouWantToHandle');

const handleAction = createYamHandler((handle) => [
  handle(actionYouHandle, (arg) => {
    // the same handling logic
    // arg.action here has type `ReturnType<typeof actionYouHandle>`
  }),
]);
```

The action creator doesn't have to come from RTK `createAction`. It just has to have a `type` property on it that is the same that the `type` of the action itself. This way `createYamHandler` derives proper types from the creator.

If you project doesn't use TS, you may pass an object instead of the function:

```js
import { createYamHandler } from 'yet-another-middleware';

const handleAction = createYamHandler({
  typeYouWantToHandle(arg) {
    // the same handling logic here
  },
  // or
  [actionYouHandle.type](arg) {
    // if you use RTK or something along those lines
  },
});
```

#### Handle a state change

You may handle only a specific piece of state change:

```ts
import type { HandlerArg } from 'yet-another-middleware';

function handleStateChange({
  select,
  stateChangedBy,
}: HandlerArg<State, Context>) {
  if (stateChangedBy(selectThing)) {
    const thing = select(selectThing);
    // handle the state change
  }
}
```

The order of `stateChangedBy` and `select` calls doesn't matter, we make sure that the old state will be passed to the selector only once.

The problems may come though if you use so-say second-order memoized selectors:

```js
const selectThing = createSelector(selectParent, (parent) => parent.thing);
const selectSecondThing = createSelector(
  selectThing,
  (thing) => thing.secondThing,
);
```

If you use `stateChangedBy` or `select` for `selectSecondThing`, it will implicitly invalidate caching for the `selectThing` as well (I mean the cache in terms of [`reselect`](https://github.com/reduxjs/reselect)). It shouldn't lead to any unexpected results regarding the prev/next state equality, but may lead to unnecessary `selectThing` result computation. And there's no sane way to avoid it but to reorganize the selectors (if such computations really bother you).
