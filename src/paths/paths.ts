const Paths = {
  api: "api",
  services: {
    "users-service": {
      users: {
        GET_ALL: {
          METHOD: "get",
          URL: "/getUsers",
        },
        GET_AMOUNT: {
          METHOD: "get",
          URL: "/getAmountOfUsers",
        },
        CREATE: {
          METHOD: "post",
          URL: "/createUser",
        },
        UPDATE: {
          METHOD: "put",
          URL: "/updateUser",
        },
        PATCH_CHAPTER: {
          METHOD: "patch",
          URL: "/patchChapter",
        },
        CHANGE_OWN_WORLD: {
          METHOD: "patch",
          URL: "/me/world/:worldId",
        },
      },
    },
    "news-service": {
      myWiki: {
        GET: {
          METHOD: "get",
          URL: "/getMyWiki",
        },
        BY_IS_PUBLISHED: {
          METHOD: "get",
          URL: "/byIsPublished",
        },
        APPROVE: {
          METHOD: "put",
          URL: "/approve/:myWikiId",
        },
        CREATE: {
          METHOD: "post",
          URL: "/createMyWiki",
        },
        UPDATE: {
          METHOD: "put",
          URL: "/updateMyWiki/:myWikiId",
        },
        DELETE: {
          METHOD: "delete",
          URL: "/deleteMyWiki/:myWikiId",
        },
      },
    },
    "item-compositor": {
      filters: {
        GET: {
          METHOD: "get",
          URL: "/get",
        },
        DELETE: {
          METHOD: "delete",
          URL: "/:filterId",
        },
      },
      filtersGroup: {
        GET_BY_ANCESTOR: {
          METHOD: "get",
          URL: "",
        },
        FIRST_FILTER: {
          METHOD: "get",
          URL: "/firstFilter",
        },
      },
      items: {
        GET_ALL: {
          METHOD: "get",
          URL: "/getAll",
        },
        TOP_5: {
          METHOD: "get",
          URL: "/Top5",
        },
        GET_ITEMS: {
          METHOD: "get",
          URL: "/getItems",
        },
        GET_FILTERED: {
          METHOD: "get",
          URL: "/get/filtered",
        },
        GET_ITEM_BY_ID: {
          METHOD: "get",
          URL: "/getItemById",
        },
        FAVORITES: {
          METHOD: "get",
          URL: "/favorites",
        },
        UPDATE: {
          METHOD: "put",
          URL: "",
        },
        CREATE: {
          METHOD: "post",
          URL: "",
        },
        SEARCH: {
          METHOD: "get",
          URL: "/search",
        },
        GET_BY: {
          METHOD: "get",
          URL: "",
        },
      },
      units: {
        GET: {
          METHOD: "get",
          URL: "/getUnits",
        },
      },
      worlds: {
        GET_ALL: {
          METHOD: "get",
          URL: "",
        },
        GET_BY_ID: {
          METHOD: "get",
          URL: "/:id",
        },
      },
    },
  },
} as const;

export default Paths;
