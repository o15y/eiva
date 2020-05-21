"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeolocationFromIp = void 0;
const geolite2_redist_1 = __importDefault(require("geolite2-redist"));
const maxmind_1 = __importDefault(require("maxmind"));
const errors_1 = require("@staart/errors");
let lookup = undefined;
const getLookup = () => __awaiter(void 0, void 0, void 0, function* () {
    if (lookup)
        return lookup;
    lookup = yield geolite2_redist_1.default.open("GeoLite2-City", (path) => {
        return maxmind_1.default.open(path);
    });
    errors_1.success("Opened GeoIP2 database reader");
    return lookup;
});
exports.getGeolocationFromIp = (ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lookup = yield getLookup();
        const ipLookup = lookup.get(ipAddress);
        if (!ipLookup)
            return;
        const location = {};
        if (ipLookup.city)
            location.city = ipLookup.city.names.en;
        if (ipLookup.continent)
            location.continent = ipLookup.continent.names.en;
        if (ipLookup.country)
            location.country_code = ipLookup.country.iso_code;
        if (ipLookup.location)
            location.latitude = ipLookup.location.latitude;
        if (ipLookup.location)
            location.longitude = ipLookup.location.longitude;
        if (ipLookup.location)
            location.time_zone = ipLookup.location.time_zone;
        if (ipLookup.location)
            location.accuracy_radius = ipLookup.location.accuracy_radius;
        if (ipLookup.postal)
            location.zip_code = ipLookup.postal.code;
        if (ipLookup.subdivisions)
            location.region_name = ipLookup.subdivisions[0].names.en;
        if (ipLookup.subdivisions)
            location.region_code = ipLookup.subdivisions[0].iso_code;
        return location;
    }
    catch (error) { }
});
//# sourceMappingURL=location.js.map