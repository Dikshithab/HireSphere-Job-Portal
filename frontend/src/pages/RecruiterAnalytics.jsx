import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

import api from "../services/api";
import "../css/RecruiterAnalytics.css";

function RecruiterAnalytics() {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const response = await api.get(
          "/applications/recruiter-analytics/"
        );

        setAnalytics(response.data);

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.error ||
            "Unable to load analytics."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchAnalytics();

  }, []);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          <div>📊</div>
          <h2>Loading analytics...</h2>
          <p>
            Preparing your recruitment insights.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-error">
          <h2>Unable to load analytics</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const summary = analytics?.summary || {};

  const statusChartData = [
    {
      name: "Pending",
      value: summary.pending || 0
    },
    {
      name: "Shortlisted",
      value: summary.shortlisted || 0
    },
    {
      name: "Rejected",
      value: summary.rejected || 0
    },
    {
      name: "Hired",
      value: summary.hired || 0
    }
  ];

  const dailyData =
    analytics?.daily_data?.map((item) => ({
      date: new Date(
        item.date
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      }),
      applications: item.count
    })) || [];

  const jobData =
    analytics?.job_data?.map((job) => ({
      name:
        job.title.length > 20
          ? `${job.title.substring(0, 20)}...`
          : job.title,
      applications: job.application_count
    })) || [];

  return (
    <div className="analytics-page">

      <div className="analytics-container">

        {/* HEADER */}

        <div className="analytics-header">

          <div>
            <span>
              HIRESPHERE RECRUITER
            </span>

            <h1>
              Recruitment Analytics
            </h1>

            <p>
              Understand your hiring pipeline
              and application activity.
            </p>
          </div>

          <div className="analytics-header-icon">
            📊
          </div>

        </div>

        {/* SUMMARY */}

        <div className="analytics-stats">

          <div className="analytics-stat-card">
            <span>💼</span>
            <small>Total Jobs</small>
            <strong>
              {summary.total_jobs || 0}
            </strong>
          </div>

          <div className="analytics-stat-card">
            <span>📄</span>
            <small>Applications</small>
            <strong>
              {summary.total_applications || 0}
            </strong>
          </div>

          <div className="analytics-stat-card">
            <span>⭐</span>
            <small>Shortlisted</small>
            <strong>
              {summary.shortlisted || 0}
            </strong>
          </div>

          <div className="analytics-stat-card">
            <span>🎉</span>
            <small>Hired</small>
            <strong>
              {summary.hired || 0}
            </strong>
          </div>

          <div className="analytics-stat-card">
            <span>📈</span>
            <small>Hiring Rate</small>
            <strong>
              {summary.hiring_rate || 0}%
            </strong>
          </div>

        </div>

        {/* CHART GRID */}

        <div className="analytics-grid">

          {/* STATUS */}

          <div className="analytics-card">

            <div className="analytics-card-header">

              <h2>
                Application Status
              </h2>

              <p>
                Current hiring pipeline
              </p>

            </div>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >

                    {statusChartData.map(
                      (_, index) => (
                        <Cell
                          key={index}
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* DAILY */}

          <div className="analytics-card">

            <div className="analytics-card-header">

              <h2>
                Application Activity
              </h2>

              <p>
                Applications received over time
              </p>

            </div>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <LineChart
                  data={dailyData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="date" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="applications"
                    strokeWidth={3}
                    dot
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* JOB CHART */}

        <div className="analytics-card job-chart-card">

          <div className="analytics-card-header">

            <h2>
              Applications by Job
            </h2>

            <p>
              Compare application volume
              across your job postings.
            </p>

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart data={jobData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="name" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="applications"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RecruiterAnalytics;