function DateFormate() {

}
function DateFormate(date,formatter) {
    this.datetime = date;
    this.formatter = formatter;
}

DateFormate.prototype.formatdate = function () {

    var year = this.datetime.getFullYear();
    var month = this.datetime.getMonth() + 1 < 10 ? "0" + (this.datetime.getMonth() + 1) : this.datetime.getMonth() + 1;
    var date = this.datetime.getDate() < 10 ? "0" + this.datetime.getDate() : this.datetime.getDate();
    var hour = this.datetime.getHours()< 10 ? "0" + this.datetime.getHours() : this.datetime.getHours();
    var minute = this.datetime.getMinutes()< 10 ? "0" + this.datetime.getMinutes() : this.datetime.getMinutes();
    var second = this.datetime.getSeconds()< 10 ? "0" + this.datetime.getSeconds() : this.datetime.getSeconds();
    return year+"" + month+"" + date+"";
};

DateFormate.prototype.getPreDate = function () {
    var curDate = this.datetime
    var preDate = new Date(curDate.getTime() - 24*60*60*1000);
    return new DateFormate(preDate,"yyyyMMdd").formatdate();
}

DateFormate.prototype.getNextDate = function () {
    var curDate = this.datetime
    var nextDate = new Date(curDate.getTime() + 24*60*60*1000);
    return new DateFormate(nextDate,"yyyyMMdd").formatdate();
}


