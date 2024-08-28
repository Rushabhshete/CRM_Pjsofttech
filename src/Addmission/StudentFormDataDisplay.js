import React from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentFormDataDisplay = () => {
  const location = useLocation();
  const formData = location.state || {};

  return (
    <div className="container mt-5">
      <h2>Student Form Data</h2>
      <table className="table table-striped table-bordered mt-3">
        <tbody>
          {Object.keys(formData).map((key) => (
            <tr key={key}>
              <th className="w-25">{key}</th>
              <td>
                {formData[key] && typeof formData[key] === 'object' ? (
                  formData[key].name
                ) : (
                  formData[key]
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentFormDataDisplay;
