export default {
  name: "my theme",
  rounding: 4,
  spacing: 32,
  global: {
    colors: {
      brand: "#7D4CFF"
    },
    font: {
      family: "Helvetica",
      size: "24px",
      height: "32px",
      maxWidth: "768px"
    },
    control: {
      border: {
        radius: "4px"
      }
    },
    borderSize: {
      xsmall: "1px",
      small: "2px",
      medium: "5.333333333333333px",
      large: "16px",
      xlarge: "32px"
    },
    breakpoints: {
      small: {
        value: 1024,
        borderSize: {
          xsmall: "1px",
          small: "2px",
          medium: "5.333333333333333px",
          large: "8px",
          xlarge: "16px"
        },
        edgeSize: {
          none: "0px",
          hair: "1px",
          xxsmall: "2px",
          xsmall: "4px",
          small: "8px",
          medium: "16px",
          large: "32px",
          xlarge: "64px"
        },
        size: {
          xxsmall: "32px",
          xsmall: "64px",
          small: "128px",
          medium: "256px",
          large: "512px",
          xlarge: "1024px",
          full: "100%"
        }
      },
      medium: {
        value: 2048
      },
      large: {}
    },
    edgeSize: {
      none: "0px",
      hair: "1px",
      xxsmall: "4px",
      xsmall: "8px",
      small: "8px",
      medium: "32px",
      large: "64px",
      xlarge: "128px",
      responsiveBreakpoint: "small"
    },
    input: {
      padding: "16px",
      weight: 600
    },
    spacing: "32px",
    size: {
      xxsmall: "64px",
      xsmall: "128px",
      small: "256px",
      medium: "512px",
      large: "1024px",
      xlarge: "1536px",
      xxlarge: "2048px",
      full: "100%"
    }
  },
  heading: {
    level: {
      "1": {
        small: {
          size: "45.33333333333333px",
          height: "53.33333333333333px",
          maxWidth: "1450.6666666666665px"
        },
        medium: {
          size: "66.66666666666666px",
          height: "74.66666666666666px",
          maxWidth: "2133.333333333333px"
        },
        large: {
          size: "109.33333333333333px",
          height: "117.33333333333333px",
          maxWidth: "3498.6666666666665px"
        },
        xlarge: {
          size: "152px",
          height: "160px",
          maxWidth: "4864px"
        }
      },
      "2": {
        small: {
          size: "34.666666666666664px",
          height: "42.666666666666664px",
          maxWidth: "1109.3333333333333px"
        },
        medium: {
          size: "45.33333333333333px",
          height: "53.33333333333333px",
          maxWidth: "1450.6666666666665px"
        },
        large: {
          size: "66.66666666666666px",
          height: "74.66666666666666px",
          maxWidth: "2133.333333333333px"
        },
        xlarge: {
          size: "88px",
          height: "96px",
          maxWidth: "2816px"
        }
      },
      "3": {
        small: {
          size: "29.333333333333332px",
          height: "37.333333333333336px",
          maxWidth: "938.6666666666666px"
        },
        medium: {
          size: "34.666666666666664px",
          height: "42.666666666666664px",
          maxWidth: "1109.3333333333333px"
        },
        large: {
          size: "45.33333333333333px",
          height: "53.33333333333333px",
          maxWidth: "1450.6666666666665px"
        },
        xlarge: {
          size: "56px",
          height: "64px",
          maxWidth: "1792px"
        }
      },
      "4": {
        small: {
          size: "24px",
          height: "32px",
          maxWidth: "768px"
        },
        medium: {
          size: "24px",
          height: "32px",
          maxWidth: "768px"
        },
        large: {
          size: "24px",
          height: "32px",
          maxWidth: "768px"
        },
        xlarge: {
          size: "24px",
          height: "32px",
          maxWidth: "768px"
        }
      },
      "5": {
        small: {
          size: "21.333333333333332px",
          height: "29.333333333333332px",
          maxWidth: "682.6666666666666px"
        },
        medium: {
          size: "21.333333333333332px",
          height: "29.333333333333332px",
          maxWidth: "682.6666666666666px"
        },
        large: {
          size: "21.333333333333332px",
          height: "29.333333333333332px",
          maxWidth: "682.6666666666666px"
        },
        xlarge: {
          size: "21.333333333333332px",
          height: "29.333333333333332px",
          maxWidth: "682.6666666666666px"
        }
      },
      "6": {
        small: {
          size: "18.666666666666668px",
          height: "26.666666666666668px",
          maxWidth: "597.3333333333334px"
        },
        medium: {
          size: "18.666666666666668px",
          height: "26.666666666666668px",
          maxWidth: "597.3333333333334px"
        },
        large: {
          size: "18.666666666666668px",
          height: "26.666666666666668px",
          maxWidth: "597.3333333333334px"
        },
        xlarge: {
          size: "18.666666666666668px",
          height: "26.666666666666668px",
          maxWidth: "597.3333333333334px"
        }
      }
    }
  },
  button: {
    border: {
      width: "2px",
      radius: "24px"
    },
    padding: {
      vertical: "6px",
      horizontal: "30px"
    }
  },
  checkBox: {
    check: {
      radius: "4px"
    },
    toggle: {
      radius: "32px",
      size: "64px"
    },
    size: "32px"
  },
  radioButton: {
    size: "32px"
  },
  calendar: {
    small: {
      fontSize: "18.666666666666668px",
      lineHeight: 1.375,
      daySize: "36.57142857142857px"
    },
    medium: {
      fontSize: "24px",
      lineHeight: 1.45,
      daySize: "73.14285714285714px"
    },
    large: {
      fontSize: "40px",
      lineHeight: 1.11,
      daySize: "146.28571428571428px"
    }
  },
  clock: {
    analog: {
      hour: {
        width: "10.666666666666666px",
        size: "32px"
      },
      minute: {
        width: "5.333333333333333px",
        size: "16px"
      },
      second: {
        width: "4px",
        size: "12px"
      },
      size: {
        small: "96px",
        medium: "128px",
        large: "192px",
        xlarge: "288px",
        huge: "384px"
      }
    },
    digital: {
      text: {
        xsmall: {
          size: "13.333333333333334px",
          height: 1.5
        },
        small: {
          size: "18.666666666666668px",
          height: 1.43
        },
        medium: {
          size: "24px",
          height: 1.375
        },
        large: {
          size: "29.333333333333332px",
          height: 1.167
        },
        xlarge: {
          size: "34.666666666666664px",
          height: 1.1875
        },
        xxlarge: {
          size: "45.33333333333333px",
          height: 1.125
        }
      }
    }
  },
  paragraph: {
    small: {
      size: "18.666666666666668px",
      height: "26.666666666666668px",
      maxWidth: "597.3333333333334px"
    },
    medium: {
      size: "24px",
      height: "32px",
      maxWidth: "768px"
    },
    large: {
      size: "29.333333333333332px",
      height: "37.333333333333336px",
      maxWidth: "938.6666666666666px"
    },
    xlarge: {
      size: "34.666666666666664px",
      height: "42.666666666666664px",
      maxWidth: "1109.3333333333333px"
    },
    xxlarge: {
      size: "45.33333333333333px",
      height: "53.33333333333333px",
      maxWidth: "1450.6666666666665px"
    }
  },
  text: {
    xsmall: {
      size: "16px",
      height: "24px",
      maxWidth: "512px"
    },
    small: {
      size: "18.666666666666668px",
      height: "26.666666666666668px",
      maxWidth: "597.3333333333334px"
    },
    medium: {
      size: "24px",
      height: "32px",
      maxWidth: "768px"
    },
    large: {
      size: "29.333333333333332px",
      height: "37.333333333333336px",
      maxWidth: "938.6666666666666px"
    },
    xlarge: {
      size: "34.666666666666664px",
      height: "42.666666666666664px",
      maxWidth: "1109.3333333333333px"
    },
    xxlarge: {
      size: "45.33333333333333px",
      height: "53.33333333333333px",
      maxWidth: "1450.6666666666665px"
    }
  }
};