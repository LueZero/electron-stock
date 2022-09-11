const stockQueryDayUrl = "https://www.twse.com.tw/exchangeReport/STOCK_DAY";
const stockQueryUrl = "https://www.twse.com.tw/zh/api/codeQuery";

initialize();

function initialize() {
    Date.prototype.Format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    document.getElementById('search-date').value = new Date().Format("yyyy-MM");
}

function get() {
    var e = document.getElementById('select-transaction-type');
    var transactionType = e.options[e.selectedIndex].text

    if (transactionType == "個股日成交資訊")
        queryStockDay();
}

function queryStock(id) {
    let stockNo = document.getElementById(id).value;
    fetch(stockQueryUrl + '?query=' + stockNo)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            let stockNoList = document.getElementById('stock-no-list');
            stockNoList.innerHTML = "";
            result.suggestions.map(function(item) {
                code = item.split("	");
                if (stockNoList == code[1]) return;
                var option = document.createElement('option');
                option.innerHTML = code[1];
                option.text = code[1];
                option.value = code[0];
                stockNoList.appendChild(option);
            })
        });
}

function queryStockDay() {
    let stockNo = document.getElementById('search-stock-no').value;
    let searchDate = document.getElementById('search-date').value;
    const date = new Date(searchDate).Format("yyyyMMdd");

    fetch(stockQueryDayUrl + '?response=json' + '&' + 'date=' + date + '&' + 'stockNo=' + stockNo)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            var title = document.getElementById('title');
            var content = document.getElementById('content');
            title.innerHTML = "";
            content.innerHTML = "";

            result.fields.map(function(item) {
                var row = title.insertCell(0);
                row.innerHTML = item;
            });

            result.data.map(function(item) {
                var row = content.insertRow(0);
                item.map(function(value) {
                    var cell2 = row.insertCell(0);
                    cell2.innerHTML = value;
                });
            });
        });
}