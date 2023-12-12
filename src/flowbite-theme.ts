import type { CustomFlowbiteTheme } from "flowbite-react";

const flowbiteTheme: CustomFlowbiteTheme = {
  badge: {
    root: {
      base: "flex flex-row",
      color: {
        primary:
          "bg-primary-100 text-primary-800 dark:bg-primary-200 dark:text-primary-800 group-hover:bg-primary-200 dark:group-hover:bg-primary-300",
        red: "bg-red-500 text-white"
      },
      size: {
        xl: "px-3 py-1 text-base rounded",
      },
    },
    icon: {
      off: "rounded-full px-2 py-1",
    },
  },
  helperText: {
    root: {
      base: "text-sm text-red-700",
    },
  },
  textInput: {
    field: {
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg px-3 py-2 text-sm",
      },
    },
  },
  button: {
    color: {
      primary:
        "text-gray-700 bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",
      gray: "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100",
    },
    outline: {
      on: "transition-all duration-75 ease-in group-hover:bg-opacity-0 group-hover:text-inherit",
    },
    size: {
      md: "text-sm px-3 py-2",
    },
  },
  label: {
    root: {
      base: "text-base font-medium",
    },
  },
  dropdown: {
    floating: {
      base: "p-1.5 z-10 w-fit rounded-xl divide-y divide-gray-100 shadow",
      content:
        "rounded-md text-sm text-gray-700 dark:text-gray-200 max-h-52 overflow-y-scroll",
      target: "w-fit dark:text-white",
    },
    content: "",
  },
  rating: {
    star: {
      filled: "text-primary-700",
    },
  },
  avatar: {
    root: {
      size: {
        md: "w-11 h-11",
        lg: "w-28 h-28"
      },
      img: {
        on: "object-cover rounded-2xl",
      },
    },
  },
  carousel: {
    scrollContainer: {
      base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-lg snap-x indiana-scroll-container indiana-scroll-container--hide-scrollbars border border-gray-200",
    },
  },
  navbar: {
    root: {
      base: "fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700",
    },
    link: {
      base: "md:hover:text-primary-700",
    },
  },
  sidebar: {
    root: {
      base: "flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 pt-1 h-full duration-75 border-r border-gray-200 w-72 lg:flex transition-width",
    },
  },
  textarea: {
    base: "block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
  },
  toggleSwitch: {
    toggle: {
      checked: {
        off: "!border-gray-200 !bg-gray-200 dark:!border-gray-600 dark:!bg-gray-700",
      },
    },
  },
  tab: {
    tabpanel: "p-0",
    tablist: {
      tabitem: {
        styles: { underline: { active: { on: "text-primary-800 border-b-2 border-primary-800" } } },
      },
    },
  },
};

export default flowbiteTheme;
