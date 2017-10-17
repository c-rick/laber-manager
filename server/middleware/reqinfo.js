
module.exports = function () {
  return (ctx, next) => {
    const start = new Date;
    return next().then(() => {
      const ms = new Date - start;
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    })
  }
}
