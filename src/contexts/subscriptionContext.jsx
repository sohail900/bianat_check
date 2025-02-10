const { createContext, useReducer } = require("react");

export const SubscriptionContext = createContext();

// create reducer
const subscriptionReducer = (state, action) => {
  switch (action.type) {
    case "STORE_SUB":
      localStorage.setItem(
        "new_sub",
        JSON.stringify({
          username: action.payload.subscriptionData.userId,
          subscribed: action.payload.subscribed,
        })
      );
      return {
        subscribed: action.payload.subscribed,
        subscriptionData: action.payload.subscriptionData,
        username: action.payload.username,
      };
    case "DELETE_SUB":
      return {
        subscribed: false,
        subscriptionData: null,
        username: null,
      };
    // case "SUBSCRIBE":
    //   localStorage.setItem(
    //     "new_sub",
    //     JSON.stringify({ username: action.payload.userId, subscribed: true })
    //   );

    //   return {
    //     subscribed: true,
    //     subscriptionData: action.payload,
    //     username: action.payload.userId,
    //   };
    // case "UNSUBSCRIBE":
    //   localStorage.setItem(
    //     "new_sub",
    //     JSON.stringify({ username: action.payload.userId, subscribed: false })
    //   );
    //   return {
    //     subscribed: false,
    //     subscriptionData: null,
    //     username: action.payload.userId,
    //   };
  }
};

export const SubscriptionContextProvider = ({ children }) => {
  const [subState, subDispatch] = useReducer(subscriptionReducer, {
    subscribed: false,
    subscriptionData: null,
    username: null,
  });

  return (
    <SubscriptionContext.Provider value={{ subState, subDispatch }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
