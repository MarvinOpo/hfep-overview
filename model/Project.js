class Project{

    constructor(){}
    
    setId(id){ this.id = id; }
    getId(){ return this.id; }

    setFacilityId(facilityId){ this.facilityId = facilityId; }
    getFacilityId(){ return this.facilityId; }

    setContractorId(contractorId){ this.contractorId = contractorId; }
    getContractorId(){ return this.contractorId; }

    setName(name){ this.name = name; }
    getName(){ return this.name; }

    setSource(source){ this.source = source }
    getSource(){ return this.source }

    setYear(year){ this.year = year }
    getYear(){ return this.year }

    setAllotment(allotment){ this.allotment = allotment }
    getAllotment(){ return this.allotment }

    setAgency(agency){ this.agency = agency }
    getAgency(){ return this.agency }

    setMayor(mayor){ this.mayor = mayor }
    getMayor(){ return this.mayor }

    setStartDate(startDate){ this.startDate = startDate }
    getStartDate(){ return this.startDate }

    setEndDate(endDate){ this.endDate = endDate }
    getEndDate(){ return this.endDate }

    setStatus(status){ this.status = status }
    getStatus(){ return this.status }

    setImages(images){ this.images = images }
    getImages(){ return this.images }

    setRemarks(remarks){ this.remarks = remarks }
    getRemarks(){ return this.remarks }
}

module.exports = Project;