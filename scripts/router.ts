"use strict";

namespace core
{

    export class Router
    {
        //public properties
        private m_activeLink: string;
        private m_routingTable: string[];

        private m_linkData : string;

        public get LinkData() : string {
            return this.m_linkData;
        }

        /**
         *
         * @param String
         */
        public set LinkData(data : string){
            this.m_linkData = data;
        }

        /**
         *
         * @returns {string}
         */
        public get ActiveLink() : string {
            return this.m_activeLink;
        }

        /**
         *
         * @param String
         */
        public set ActiveLink(link : string){
            this.m_activeLink = link;
        }

        //Constructors
        public constructor(){
            this.m_activeLink = "";
            this.m_routingTable = [];
            this.m_linkData = "";
        }

        //public methods
        public Add(route  : string){
            this.m_routingTable.push(route);
        }

        public AddTable(routingTable : string[]) : void {
            this.m_routingTable = routingTable;
        }

        public Find(route : string) : number {
            return this.m_routingTable.indexOf(route);
        }

        public Remove(route : string) : boolean {
            if(this.Find(route) > -1){
                this.m_routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        }

        //public overrides
        public toString() : string {
            return this.m_routingTable.toString();
        }




    }
}

let router : core.Router = new core.Router();

router.AddTable([
    "/",
    "/home",
    "/about",
    "/contact",
    "/contact-list",
    "/edit",
    "/login",
    "/products",
    "/register",
    "/services",
]);

let route : string = location.pathname;

router.ActiveLink = (router.Find(route) > -1)                           //IF CONDITION (True or False)
                    ? (route === "/" ) ? "home" : route.substring(1)    //TRUE
                    : ("404");                                          //FALSE