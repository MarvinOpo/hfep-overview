class Facility{

    constructor(){}
    
    setId(id){ this.id = id; }
    getId(){ return this.id; }

    setMuncity(muncity){ this.muncity = muncity }
    getMuncity(){ return this.muncity }

    setName(name){ this.name = name; }
    getName(){ return this.name; }

    setAddress(address){ this.address = address }
    getAddress(){ return this.address }

    setLicense(license){ this.license = license }
    getLicense(){ return this.license }

    setBedsNo(bedNo){ this.bedNo = bedNo }
    getBedsNo(){ return this.bedNo }

    setType(type){ this.type = type }
    getType(){ return this.type }
}

module.exports = Facility;
