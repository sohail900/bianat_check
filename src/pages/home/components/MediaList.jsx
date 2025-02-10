import React from "react";
import { Image } from "antd";
const MediaList = () => {
  return (
    <div>
      <div className="d-flex d-none">
        <div className="flex-shrink-0">
          <Image
            src="https://via.placeholder.com/50/c4d4e1?Text=BIANAT"
            alt="..."
            preview={false}
          />
        </div>
        <div className="flex-grow-1 ms-3">
          This is some content from a media component. Using the most basic
          table markup
        </div>
      </div>
      <div className="d-flex d-none">
        <div className="flex-shrink-0">
          <Image
            src="https://via.placeholder.com/50/c4d4e1?Text=BIANAT"
            alt="..."
            preview={false}
          />
        </div>
        <div className="flex-grow-1 ms-3">
          This is some content from a media component. Using the most basic
          table markup
        </div>
      </div>
      <table className="table chart-table">
        <thead>
          <tr>
            <th></th>
            <th>Pair</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <i className="fa-regular fa-star"></i>
            </td>
            <td>0.05870</td>
            <td className="text-success">.0622</td>
            <td className="text-dangers">-23.80%</td>
          </tr>
          <tr>
            <td>
              <i className="fa-regular fa-star"></i>
            </td>
            <td>ONT/BTC</td>
            <td className="text-success">.090</td>
            <td className="text-dangers">+8.70%</td>
          </tr>
          <tr>
            <td>
              <i className="fa-regular fa-star"></i>
            </td>
            <td>0.05870</td>
            <td className="text-success">.0622</td>
            <td className="text-dangers">-23.80%</td>
          </tr>
          <tr>
            <td>
              <i className="fa-regular fa-star"></i>
            </td>
            <td>ONT/BTC</td>
            <td className="text-success">.090</td>
            <td className="text-dangers">+8.70%</td>
          </tr>
          <tr>
            <td>
              <i className="fa-regular fa-star"></i>
            </td>
            <td>0.05870</td>
            <td className="text-success">.0622</td>
            <td className="text-dangers">-23.80%</td>
          </tr>
          <tr>
            <td>
              <i className="fa-regular fa-star"></i>
            </td>
            <td>ONT/BTC</td>
            <td className="text-success">.090</td>
            <td className="text-dangers">+8.70%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MediaList;
