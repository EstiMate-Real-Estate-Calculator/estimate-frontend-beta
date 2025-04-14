import React from 'react'
import PropertyCard from "../PropertyCard";
import { Row, Col } from 'antd';

const FeaturedProperties = () => {

    // Dummy Property Data to show on homepage
    let PropertyData = [
        {
            "reportId": 4,
            "userId": 1,
            "propertyId": "34229636",
            "reportNickName": "",
            "creation_date": "2025-04-11T14:55:07.127Z",
            "last_modified": "2025-04-11T14:55:07.127Z",
            "website": "zillow.com",
            "address": "1506 Carolina Ave",
            "city": "Cincinnati",
            "units": 1,
            "state": "OH",
            "zip": null,
            "image": "https://photos.zillowstatic.com/fp/ff3563a9962123fd7d94800f26cfd3ea-p_f.jpg",
            "interest": 0.06854,
            "closing_cost": 0.03,
            "exit_cap": 0.07,
            "loan_to_value": 70,
            "year_one_cap": 0.1064089575289575,
            "unlevered_irr": 15.85799785223826,
            "levered_irr": 27.99647277488597,
            "unlevered_mom": 3.107401809339436,
            "levered_mom": 6.540469286588208,
            "levered_profit": 603471.2974749409,
            "bedrooms": 4,
            "bathrooms": 2,
            "year_built": 1929,
            "water_source": "",
            "property_subtype": null,
            "listing_price": 259000,
            "sales_status": null,
            "sqft": 2204,
            "all_NOI": [
                27559.92,
            ],
            "all_revenue": [
                23423
            ],
            "expense_growth": 0.02,
            "revenue_growth": 0.03,
            "selling_cost": 0.05,
            "reserves": 0
        },
        {
            "reportId": 4,
            "userId": 1,
            "propertyId": "34229636",
            "reportNickName": "",
            "creation_date": "2025-04-11T14:55:07.127Z",
            "last_modified": "2025-04-11T14:55:07.127Z",
            "website": "zillow.com",
            "address": "1506 Carolina Ave",
            "city": "Cincinnati",
            "units": 1,
            "state": "OH",
            "zip": null,
            "image": "https://photos.zillowstatic.com/fp/ff3563a9962123fd7d94800f26cfd3ea-p_f.jpg",
            "interest": 0.06854,
            "closing_cost": 0.03,
            "exit_cap": 0.07,
            "loan_to_value": 70,
            "year_one_cap": 0.1064089575289575,
            "unlevered_irr": 15.85799785223826,
            "levered_irr": 27.99647277488597,
            "unlevered_mom": 3.107401809339436,
            "levered_mom": 6.540469286588208,
            "levered_profit": 603471.2974749409,
            "bedrooms": 4,
            "bathrooms": 2,
            "year_built": 1929,
            "water_source": "",
            "property_subtype": null,
            "listing_price": 259000,
            "sales_status": null,
            "sqft": 2204,
            "all_NOI": [
                27559.92,
            ],
            "all_revenue": [
                23423
            ],
            "expense_growth": 0.02,
            "revenue_growth": 0.03,
            "selling_cost": 0.05,
            "reserves": 0
        },
        {
            "reportId": 4,
            "userId": 1,
            "propertyId": "34229636",
            "reportNickName": "",
            "creation_date": "2025-04-11T14:55:07.127Z",
            "last_modified": "2025-04-11T14:55:07.127Z",
            "website": "zillow.com",
            "address": "1506 Carolina Ave",
            "city": "Cincinnati",
            "units": 1,
            "state": "OH",
            "zip": null,
            "image": "https://photos.zillowstatic.com/fp/ff3563a9962123fd7d94800f26cfd3ea-p_f.jpg",
            "interest": 0.06854,
            "closing_cost": 0.03,
            "exit_cap": 0.07,
            "loan_to_value": 70,
            "year_one_cap": 0.1064089575289575,
            "unlevered_irr": 15.85799785223826,
            "levered_irr": 27.99647277488597,
            "unlevered_mom": 3.107401809339436,
            "levered_mom": 6.540469286588208,
            "levered_profit": 603471.2974749409,
            "bedrooms": 4,
            "bathrooms": 2,
            "year_built": 1929,
            "water_source": "",
            "property_subtype": null,
            "listing_price": 259000,
            "sales_status": null,
            "sqft": 2204,
            "all_NOI": [
                27559.92,
            ],
            "all_revenue": [
                23423
            ],
            "expense_growth": 0.02,
            "revenue_growth": 0.03,
            "selling_cost": 0.05,
            "reserves": 0
        }
    ]

    const handleDeleteProperty = (Id) => {
        console.log("Delete", Id)
    }

    return (
        <>
            <div className='featuredPropertiesWrapper'>
                <div>
                    <h2 className="title">Featured Potential Properties</h2>
                    <Row gutter={16}>
                        {PropertyData?.map((property) => (
                            <Col md={8} xs={24}>
                                <PropertyCard
                                    key={property.propertyId}
                                    property={property}
                                    onDelete={() => handleDeleteProperty(property.propertyId)}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
                <div className='comingSoon'>Coming Soon</div>
            </div>
        </>
    )
}

export default FeaturedProperties