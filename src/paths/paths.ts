const Paths = {
  api: "api",
  services: {
    "users-service": {
      users: {
        GET_ALL: {
          METHOD: "get",
          url: "/getUsers",
        },
        GET_AMOUNT: {
          METHOD: "get",
          url: "/getAmountOfUsers",
        },
        CREATE: {
          METHOD: "post",
          url: "/createUser",
        },
        UPDATE: {
          METHOD: "put",
          url: "/updateUser",
        },
        PATCH_CHAPTER: {
          METHOD: "patch",
          url: "/patchChapter",
        },
        CHANGE_OWN_WORLD: {
          METHOD: "patch",
          url: "/me/world/:worldId",
        },
      },
    },
    "news-service": {
      myWiki: {
        GET: {
          METHOD: "get",
          url: "/getMyWiki",
        },
        BY_IS_PUBLISHED: {
          METHOD: "get",
          url: "/byIsPublished",
        },
        APPROVE: {
          METHOD: "put",
          url: "/approve/:myWikiId",
        },
        CREATE: {
          METHOD: "post",
          url: "/createMyWiki",
        },
        UPDATE: {
          METHOD: "put",
          url: "/updateMyWiki/:myWikiId",
        },
        DELETE: {
          METHOD: "delete",
          url: "/deleteMyWiki/:myWikiId",
        },
      },
    },
    "item-compositor": {
      filters: {
        GET: {
          METHOD: "get",
          url: "/get",
        },
        DELETE: {
          METHOD: "delete",
          url: "/:filterId",
        },
      },
      filtersGroup: {
        GET_BY_ANCESTOR: {
          METHOD: "get",
          url: "",
        },
        FIRST_FILTER: {
          METHOD: "get",
          url: "/firstFilter",
        },
      },
      items: {
        GET_ALL: {
          METHOD: "get",
          url: "/getAll",
        },
        TOP_5: {
          METHOD: "get",
          url: "/Top5",
        },
        GET_ITEMS: {
          METHOD: "get",
          url: "/getItems",
        },
        GET_FILTERED: {
          METHOD: "get",
          url: "/get/filtered",
        },
        GET_ITEM_BY_ID: {
          METHOD: "get",
          url: "/getItemById",
        },
        FAVORITES: {
          METHOD: "get",
          url: "/favorites",
        },
        UPDATE: {
          METHOD: "put",
          url: "",
        },
        CREATE: {
          METHOD: "post",
          url: "",
        },
        SEARCH: {
          METHOD: "get",
          url: "/search",
        },
        GET_BY: {
          METHOD: "get",
          url: "",
        },
      },
      units: {
        GET: {
          METHOD: "get",
          url: "/getUnits",
        },
      },
      worlds: {
        GET_ALL: {
          METHOD: "get",
          url: "",
        },
        GET_BY_ID: {
          METHOD: "get",
          url: "/:id",
        },
      },
    },
  },
} as const;

export default Paths;
