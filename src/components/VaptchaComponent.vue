<template>
  <!-- 点击式按钮建议高度介于36px与46px  -->
  <div id="VAPTCHAContainer" style="width: 300px; height: 36px">
    <!-- 下面代码为预加载动画代码，仅供参考 -->
    <div class="VAPTCHA-init-main">
      <div class="VAPTCHA-init-loading">
        <a href="/" target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="48px"
            height="60px"
            viewBox="0 0 24 30"
            style="
              enable-background: new 0 0 50 50;
              width: 14px;
              height: 14px;
              vertical-align: middle;
            "
            xml:space="preserve"
          >
            <rect x="0" y="9.22656" width="4" height="12.5469" fill="#CCCCCC">
              <animate
                attributeName="height"
                attributeType="XML"
                values="5;21;5"
                begin="0s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="y"
                attributeType="XML"
                values="13; 5; 13"
                begin="0s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
            </rect>
            <rect x="10" y="5.22656" width="4" height="20.5469" fill="#CCCCCC">
              <animate
                attributeName="height"
                attributeType="XML"
                values="5;21;5"
                begin="0.15s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="y"
                attributeType="XML"
                values="13; 5; 13"
                begin="0.15s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
            </rect>
            <rect x="20" y="8.77344" width="4" height="13.4531" fill="#CCCCCC">
              <animate
                attributeName="height"
                attributeType="XML"
                values="5;21;5"
                begin="0.3s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="y"
                attributeType="XML"
                values="13; 5; 13"
                begin="0.3s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
            </rect>
          </svg>
        </a>
        <span class="VAPTCHA-text">Vaptcha Initializing...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

const loadScript = (SRC = "https://v-cn.vaptcha.com/v3.js") => {
  if (typeof window.vaptcha === "function") {
    return Promise.resolve();
  } else {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      script.onload = script.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState == "loaded" ||
          this.readyState == "complete"
        ) {
          resolve();
          script.onload = script.onreadystatechange = null;
        }
      };
      document.head.appendChild(script);
    });
  }
};

const init = (props, emit) => {
  loadScript().then(() => {
    const config = {
      vid: "6134bf861ed1331e19c12c0f",
      mode: "click",
      scene: props.scene, // 1 登录 2 注册 3 找回密码
      container: "#VAPTCHAContainer",
    };

    window.vaptcha(config).then((obj) => {
      // window.$vOBJ = obj;
      obj.render();

      // obj.listen("pass", function () {
      //   const serverToken = obj.getServerToken();
      //   const data = {
      //     server: serverToken.server,
      //     token: serverToken.token,
      //   };

      //   console.log("OK:", data);
      // });
      // obj.listen("close", function () {
      //   console.log("Close");
      //   obj.reset();
      // });
      obj.listen("pass", function () {
        emit("pass", obj);
      });
      obj.listen("close", function () {
        emit("close");
        obj.reset();
      });
    });
  });
};

export default defineComponent({
  components: {},
  props: ["scene"],
  emits: ["pass", "close"],
  setup(props, { emit }) {
    init(props, emit);
    return {};
  },
});
</script>

<style>
.VAPTCHA-init-main {
  display: table;
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
}

.VAPTCHA-init-loading {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

.VAPTCHA-init-loading > a {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: none;
}

.VAPTCHA-init-loading .VAPTCHA-text {
  font-family: sans-serif;
  font-size: 12px;
  color: #cccccc;
  vertical-align: middle;
}
</style>
