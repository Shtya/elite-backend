"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const serverless_http_1 = require("serverless-http");
const path_1 = require("path");
const QueryFailedErrorFilter_1 = require("./common/QueryFailedErrorFilter");
let cachedServer;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(app.get(QueryFailedErrorFilter_1.QueryFailedErrorFilter));
    app.useStaticAssets((0, path_1.join)(__dirname, 'uploads'), { prefix: '/uploads/' });
    await app.init();
    return (0, serverless_http_1.default)(app.getHttpAdapter().getInstance());
}
const handler = async (event, context) => {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }
    return cachedServer(event, context);
};
exports.handler = handler;
//# sourceMappingURL=main.js.map