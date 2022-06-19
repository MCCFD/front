/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    echarts.registerTheme('naiveui', {
        "color": [
            "#63e2b7"
        ],
        "backgroundColor": "#18181c",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "rgba(255,255,255,0.82)"
            },
            "subtextStyle": {
                "color": "rgba(255,255,255,0.52)"
            }
        },
        "line": {
            "itemStyle": {
                "borderWidth": "1"
            },
            "lineStyle": {
                "width": "2"
            },
            "symbolSize": "5",
            "symbol": "emptyCircle",
            "smooth": false
        },
        "radar": {
            "itemStyle": {
                "borderWidth": "1"
            },
            "lineStyle": {
                "width": "2"
            },
            "symbolSize": "5",
            "symbol": "emptyCircle",
            "smooth": false
        },
        "bar": {
            "itemStyle": {
                "barBorderWidth": 0,
                "barBorderColor": "#e4e4e4"
            }
        },
        "pie": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#e4e4e4"
            }
        },
        "scatter": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#e4e4e4"
            }
        },
        "boxplot": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#e4e4e4"
            }
        },
        "parallel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#e4e4e4"
            }
        },
        "sankey": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#e4e4e4"
            }
        },
        "funnel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#e4e4e4"
            }
        },
        "gauge": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#e4e4e4"
            }
        },
        "candlestick": {
            "itemStyle": {
                "color": "#eb5454",
                "color0": "#47b262",
                "borderColor": "#eb5454",
                "borderColor0": "#47b262",
                "borderWidth": 1
            }
        },
        "graph": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#e4e4e4"
            },
            "lineStyle": {
                "width": 1,
                "color": "#aaa"
            },
            "symbolSize": "5",
            "symbol": "emptyCircle",
            "smooth": false,
            "color": [
                "#63e2b7"
            ],
            "label": {
                "color": "#ffffff"
            }
        },
        "map": {
            "itemStyle": {
                "areaColor": "#eee",
                "borderColor": "#444",
                "borderWidth": 0.5
            },
            "label": {
                "color": "#000"
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "rgba(255,215,0,0.8)",
                    "borderColor": "#444",
                    "borderWidth": 1
                },
                "label": {
                    "color": "rgb(100,0,0)"
                }
            }
        },
        "geo": {
            "itemStyle": {
                "areaColor": "#eee",
                "borderColor": "#444",
                "borderWidth": 0.5
            },
            "label": {
                "color": "#000"
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "rgba(255,215,0,0.8)",
                    "borderColor": "#444",
                    "borderWidth": 1
                },
                "label": {
                    "color": "rgb(100,0,0)"
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "rgba(255,255,255,0.9)"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "rgba(255,255,255,0.9)"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "rgba(255,255,255,0.9)"
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#E0E6F1"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "rgba(255,255,255,0.9)"
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "rgba(255,255,255,0.5)"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#6E7079"
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#e0e6f1"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#6e7079"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#6E7079"
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#E0E6F1"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "borderColor": "#999999"
            },
            "emphasis": {
                "iconStyle": {
                    "borderColor": "#666666"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "rgba(255,255,255,0.9)"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#cccccc",
                    "width": 1
                },
                "crossStyle": {
                    "color": "#cccccc",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#DAE1F5",
                "width": 2
            },
            "itemStyle": {
                "color": "#A4B1D7",
                "borderWidth": 1
            },
            "controlStyle": {
                "color": "#A4B1D7",
                "borderColor": "#A4B1D7",
                "borderWidth": 1
            },
            "checkpointStyle": {
                "color": "#316bf3",
                "borderColor": "fff"
            },
            "label": {
                "color": "#A4B1D7"
            },
            "emphasis": {
                "itemStyle": {
                    "color": "#FFF"
                },
                "controlStyle": {
                    "color": "#A4B1D7",
                    "borderColor": "#A4B1D7",
                    "borderWidth": 1
                },
                "label": {
                    "color": "#A4B1D7"
                }
            }
        },
        "visualMap": {
            "color": [
                "#bf444c",
                "#d88273",
                "#f6efa6"
            ]
        },
        "dataZoom": {
            "handleSize": "undefined%",
            "textStyle": {}
        },
        "markPoint": {
            "label": {
                "color": "#ffffff"
            },
            "emphasis": {
                "label": {
                    "color": "#ffffff"
                }
            }
        }
    });
}));
