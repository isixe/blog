(function () {
	const donate = {
		message: "请我喝一杯咖啡 ☕︎",
		wechatpay: "/images/reward/wechatpay.png",
		alipay: "/images/reward/alipay.png",
	};

	const blackPath = ["/", "/archives/", "/categories/", "/tags/", "/about/"];
	if (blackPath.includes(window.location.pathname)) {
		return;
	}

	//append rewards container to article
	const rewardHTML = `
        <div class="reward-container">
                <div id="rewardBtn" class="reward-btn">
                        ❤
                </div>
                <p class="tea">“${donate.message || ""}”</p>
                <div id="rewardImgContainer" class="reward-img-container">
                    <div class="singleImgContainer">
                        <img id="wechatImg" class="reward-img" src="${donate.wechatpay || ""}" alt="微信二维码">
                        <p class="wechatPay">微信支付</p>
                    </div>
                    <div class="singleImgContainer">
                        <img id="alipayImg" class="reward-img" src="${donate.alipay || ""}" alt="支付宝二维码">
                        <p class="aliPay">支付宝支付</p>
                    </div>
                </div>
        </div>`;
	const rewardsAnchor = document.querySelector(".markdown-body");
	const rewardContainer = document.createElement("div");
	rewardContainer.innerHTML = rewardHTML;
	rewardsAnchor.after(rewardContainer);

	rewardContainer.addEventListener("click", () => {
		const rewardImgContainer = document.getElementById("rewardImgContainer");
		const display =
			rewardImgContainer.style.display === "none" || rewardImgContainer.style.display === "" ? "inline-flex" : "none";
		rewardImgContainer.style.display = display;
		setTimeout(() => {
			rewardImgContainer.style.opacity =
				rewardImgContainer.style.opacity === "0" || rewardImgContainer.style.opacity === "" ? "1" : "0";
		}, 10);
	});
})();
