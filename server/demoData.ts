import { Project } from '../src/types/research.ts';

export const DEMO_PROJECT: Project = {
  id: 'demo-machinery-predictive-maintenance',
  title: 'Machine Learning for Predictive Maintenance of Rotating Machinery',
  topic: 'Vibration Analysis, Sensor Fusion, and Remaining Useful Life (RUL) Prediction in High-Speed Induction Motors',
  question: 'How do hybrid deep learning architectures (CNN-LSTM) compare to traditional feature-engineered Random Forests in predicting Remaining Useful Life (RUL) under varying mechanical load and noisy acoustic-vibration environments?',
  objectives: '1. Benchmark hybrid spatial-temporal neural networks against classical feature engineering.\n2. Quantify model degradation under non-stationary rotational velocities and thermal drift.\n3. Identify failure mode signatures in high-frequency accelerometry datasets.',
  field: 'Engineering',
  keywords: ['Predictive Maintenance', 'Rotating Machinery', 'Vibration Analysis', 'Deep Learning', 'Remaining Useful Life', 'Induction Motors', 'Acoustic Emission'],
  level: 'Researcher',
  createdAt: '2026-03-15T09:00:00.000Z',
  updatedAt: '2026-03-20T14:30:00.000Z',
  selectedProvider: 'grok',
  selectedModel: 'grok-4.6',
  plan: {
    researchObjective: 'Systematically evaluate and benchmark temporal deep learning architectures against domain-engineered statistical vibration features for Remaining Useful Life (RUL) estimation in rotating electromechanical bearings and gearboxes under variable operating conditions.',
    subquestions: [
      'What specific time-domain and frequency-domain statistical moments (kurtosis, skewness, crest factor) provide the highest mutual information with bearing raceway degradation?',
      'How does acoustic emission (AE) sensor fusion supplement triaxial accelerometer streams during incipient micro-crack initiation prior to measurable vibration emergence?',
      'What is the computational latency and memory footprint trade-off of running 1D-CNN feature extractors on industrial edge gateways versus cloud inference?'
    ],
    importantKeywords: [
      'Vibration Spectrometry',
      'Envelope Analysis',
      'Fast Fourier Transform (FFT)',
      '1D-CNN-LSTM',
      'Prognostics and Health Management (PHM)',
      'Bearing Fault Signatures (BPFO, BPFI, BSF)'
    ],
    suggestedStructure: [
      'I. Introduction & Electromechanical Fault Taxonomy',
      'II. State of the Art: Signal Processing vs. Deep Representation Learning',
      'III. Experimental Testbed Setup & Controlled Degradation Datasets',
      'IV. Architecture Specification: Dual-Path Hybrid Temporal Network',
      'V. Empirical Results Across Constant vs Dynamic Load Regimes',
      'VI. Sensitivity Analysis to Gaussian Sensor Noise & Thermal Drift',
      'VII. Synthesis of Potential Gaps and Edge Deployment Constraints'
    ],
    sourceCategories: [
      'Empirical Bearing Degradation Benchmarks (Run-to-failure)',
      'Signal Processing & Envelope Demodulation Literature',
      'Deep Learning for Time-Series Prognostics',
      'Industrial Field Case Studies & Sensor Standardization'
    ],
    methodologyPossibilities: [
      'Supervised regression targeting continuous RUL normalized percentages [0.0 - 1.0]',
      'Semi-supervised autoencoder anomaly scoring on healthy baseline runs',
      'Hilbert-Huang Transform (HHT) combined with Bi-LSTM temporal attention',
      'Domain adaptation via Wasserstein GAN to bridge testbed-to-factory distribution shifts'
    ],
    variablesToInvestigate: [
      'Rotational speed (RPM: 1200 - 3600)',
      'Radial static & dynamic load (kN: 2.5 - 12.0)',
      'Sampling frequency (25.6 kHz vibration, 1 MHz acoustic emission)',
      'Lubrication viscosity index and localized bearing temperature'
    ],
    potentialLimitations: [
      'Lack of accelerated life testing correlation to decade-long natural wear in operating plants',
      'Severe class imbalance between healthy operating regimes and final catastrophic failure phases',
      'Sensitivity of acoustic transducers to industrial ambient shop-floor background interference'
    ],
    potentialResearchGaps: [
      'Insufficient public datasets recording simultaneous mechanical load transitions and lubrication starvation',
      'Scarcity of real-time latency measurements for deep neural architectures on edge PLCs'
    ],
    providerUsed: 'Grok / xAI Engine',
    modelUsed: 'grok-4.6',
    generatedAt: '2026-03-15T09:15:00.000Z'
  },
  sources: [
    {
      id: 'demo-source-1',
      projectId: 'demo-machinery-predictive-maintenance',
      title: '[DEMO BENCHMARK] Multi-Sensor Vibration Analysis for Accelerated Bearing Degradation in Induction Drives',
      authors: ['H. Vance', 'R. Chen', 'T. Al-Mansoor'],
      publicationDate: '2025-08-14',
      sourceType: 'Journal Article',
      url: 'https://example.org/demo-archive/phm-2025-vance',
      doi: '10.1016/j.demo.phm.2025.109214',
      abstract: 'This controlled empirical study evaluates 16 industrial tapered roller bearings subjected to accelerated run-to-failure fatigue testing under 8.5 kN constant radial loads at 1800 RPM. Synchronized triaxial vibration data (25.6 kHz) and thermocouple telemetry were captured continuously until cage seizure. We evaluate kurtosis trajectory transitions against spectral energy in the Ball Pass Frequency Outer-Race (BPFO) harmonics.',
      summary: 'Controlled laboratory study tracking 16 bearings to failure. Demonstrated that spectral kurtosis identifies degradation 42 operating hours prior to standard RMS threshold alarms.',
      relevance: 'Core',
      tags: ['Accelerated Fatigue', 'Bearing Degradation', 'BPFO', 'Triaxial Accelerometer'],
      status: 'Analyzed',
      isDemo: true,
      addedAt: '2026-03-15T10:00:00.000Z',
      analysis: {
        summary: 'Rigorous empirical trial demonstrating that envelope kurtosis provides early warning of localized outer race spalling significantly earlier than root-mean-square acceleration.',
        researchObjective: 'Quantify lead time of statistical envelope moments versus bulk amplitude RMS for outer-race flaking under steady-state mechanical loading.',
        methodology: 'Accelerated bearing fatigue test rig with hydraulic load actuator (8.5 kN) and constant 1800 RPM induction motor drive. Sensors: PCB 356A15 triaxial accelerometer.',
        datasetExperimentalInfo: '16 tapered roller bearings (SKF 32008), 25.6 kHz continuous sampling rate, 380 total testing hours, 100% run-to-failure.',
        variables: ['Radial Load (8.5 kN)', 'Shaft Velocity (1800 RPM)', 'Sampling Frequency (25.6 kHz)', 'Lubricant Temperature (22-78 °C)'],
        keyFindings: [
          'Kurtosis in the 3.2 kHz - 5.8 kHz resonance band increased from 3.1 to 14.8 at an average of 42.4 ± 3.1 hours prior to structural seizure.',
          'Broadband RMS vibration remained within ISO 10816 acceptable limits until 6.2 hours before catastrophic cage breakdown.',
          'High thermal gradients (>65 °C) introduced 8.4% amplitude drift on piezoelectric sensor gain.'
        ],
        limitations: [
          'Constant rotational speed only; does not evaluate variable speed acceleration or regenerative braking cycles.',
          'Only outer-race seeded/natural spalls were monitored; inner-race and ball element defects were excluded from this batch.'
        ],
        futureWork: [
          'Extend test matrix to variable duty cycles (0 - 3000 RPM ramps).',
          'Integrate high-frequency acoustic emission probes alongside accelerometers.'
        ],
        importantEvidence: [
          '"Spectral kurtosis peaked at 14.8 at T-42.4 hours before catastrophic cage breakdown, while ISO RMS limits were breached only at T-6.2 hours."',
          '"Sensor temperature coefficients produced an uncorrected 8.4% amplitude bias when bearing housings reached 74 °C."'
        ],
        researchRelevance: 'Direct baseline for establishing ground-truth statistical feature engineering performance before applying complex neural networks.',
        analyzedAt: '2026-03-15T10:15:00.000Z',
        providerUsed: 'grok'
      }
    },
    {
      id: 'demo-source-2',
      projectId: 'demo-machinery-predictive-maintenance',
      title: '[DEMO ARCHITECTURE] Temporal Convolutional Networks and Attention Mechanisms for Remaining Useful Life Estimation',
      authors: ['E. Lindqvist', 'M. Kowalski'],
      publicationDate: '2025-11-02',
      sourceType: 'Conference Paper',
      url: 'https://example.org/demo-archive/icml-prognostics-lindqvist',
      doi: '10.1109/DEMO.PHMCONF.2025.882190',
      abstract: 'Deep learning models for mechanical prognostics often suffer from temporal receptive field decay over long operating cycles. In this paper, we propose a dilated Temporal Convolutional Network with multi-head self-attention (TCN-Attn) for continuous RUL regression. We benchmark the network across two open datasets and an industrial dynamometer test bench.',
      summary: 'Proposes a 1D Dilated TCN with multi-head attention that achieves a 14.2% reduction in Mean Absolute Error (MAE) compared to standard Bi-LSTM networks on synthetic vibration benchmarks.',
      relevance: 'Core',
      tags: ['TCN', 'Self-Attention', 'RUL Prediction', 'Deep Learning', 'Edge Latency'],
      status: 'Analyzed',
      isDemo: true,
      addedAt: '2026-03-15T10:30:00.000Z',
      analysis: {
        summary: 'Introduces a dilated temporal convolutional network with causal convolutions and 4-head self-attention for continuous RUL regression.',
        researchObjective: 'Overcome vanishing gradient limitations and sequential inference latency in recurrent architectures when processing long raw vibration sequences.',
        methodology: 'Dilated 1D-TCN with receptive field covering 16,384 samples (0.64 s at 25.6 kHz), causal padding, multi-head attention module, trained via AdamW with cosine decay.',
        datasetExperimentalInfo: 'Validated on IEEE PHM 2012 Bearing Dataset and simulated motor dynamometer data (30 run-to-failure sequences).',
        variables: ['Dilation factors (1, 2, 4, 8, 16)', 'Attention heads (4)', 'Sequence window length (2048 samples)', 'Batch size (64)'],
        keyFindings: [
          'TCN-Attn achieved a Mean Absolute Error of 0.082 normalized RUL vs. 0.096 for Bi-LSTM and 0.124 for Random Forest.',
          'Inference speed on an embedded Jetson Orin Nano was 4.8 ms per window, 3.2x faster than the equivalent Bi-LSTM baseline.',
          'Model accuracy degraded by 28% when transferred to unseen mechanical loads (load changed from 10 kN to 14 kN).'
        ],
        limitations: [
          'Significant performance degradation when tested on unseen operational speeds and radial loads without fine-tuning.',
          'High memory footprint during backpropagation training (requires >8 GB VRAM).'
        ],
        futureWork: [
          'Develop lightweight domain-adversarial training to ensure cross-load invariance.',
          'Quantize weights to INT8 precision for microcontroller deployment.'
        ],
        importantEvidence: [
          '"Inference latency measured 4.8 ms per 2048-sample window on NVIDIA Jetson Orin Nano, enabling real-time edge decision loops within 10 ms cycle times."',
          '"Out-of-distribution load shifts (10 kN to 14 kN) led to an immediate 28.1% degradation in RUL prediction accuracy."'
        ],
        researchRelevance: 'Provides state-of-the-art computational latency and RUL regression benchmark metrics for deep learning models.',
        analyzedAt: '2026-03-15T10:45:00.000Z',
        providerUsed: 'groq'
      }
    },
    {
      id: 'demo-source-3',
      projectId: 'demo-machinery-predictive-maintenance',
      title: '[DEMO COMPARATIVE] Sensor Fusion of Acoustic Emissions and Piezoelectric Accelerometers in Industrial Motors',
      authors: ['S. Nakamura', 'B. O\'Connor', 'D. Weber'],
      publicationDate: '2026-01-20',
      sourceType: 'Journal Article',
      url: 'https://example.org/demo-archive/sensors-2026-nakamura',
      doi: '10.3390/demo-sensors-2026-00412',
      abstract: 'While piezoelectric accelerometers remain the de facto industry standard for mechanical health monitoring, high-frequency Acoustic Emission (AE) sensors (100 kHz - 1 MHz) capture stress waves from plastic deformation and subsurface micro-cracks before surface spalling emerges. We present a dual-modality fusion pipeline evaluated on a 75 kW induction motor under transient torque reversals.',
      summary: 'Demonstrates that AE sensors detect subsurface shear stress dislocations 60-80 hours earlier than standard accelerometers, but suffer from high computational ingestion bottlenecks.',
      relevance: 'Supporting',
      tags: ['Acoustic Emission', 'Sensor Fusion', 'Transient Torque', 'Micro-cracking'],
      status: 'Analyzed',
      isDemo: true,
      addedAt: '2026-03-15T11:00:00.000Z',
      analysis: {
        summary: 'Investigation of early micro-damage detection comparing ultrasonic acoustic emissions (1 MHz) with standard piezoelectric vibration sensors (20 kHz).',
        researchObjective: 'Determine the incremental diagnostic value of combining high-frequency stress wave analysis with traditional vibration telemetry under dynamic torque loads.',
        methodology: 'Dual-sensor acquisition on a 75 kW induction motor connected to an eddy-current dynamometer. High-speed PCI DAQ recording 1 MS/s AE and 50 kS/s vibration.',
        datasetExperimentalInfo: '8 controlled run-to-failure cycles with intentional lubrication degradation and cyclic torque reversals (±150 Nm).',
        variables: ['Torque reversal frequency (0.5 Hz)', 'AE frequency band (100 kHz - 900 kHz)', 'Sensor mounting geometry (magnetic vs stud mount)'],
        keyFindings: [
          'Acoustic emission energy bursts emerged 78 hours prior to any statistically significant rise in accelerometer envelope kurtosis.',
          'Data throughput for continuous AE monitoring exceeded 120 MB/minute per bearing, making direct cloud streaming cost-prohibitive without edge feature extraction.',
          'Stud-mounted sensors exhibited 18 dB higher signal-to-noise ratio compared to standard magnetic mounts at frequencies above 300 kHz.'
        ],
        limitations: [
          'Extremely high data bandwidth demands specialized acquisition hardware that is rarely present in legacy plant installations.',
          'Acoustic emissions are highly susceptible to airborne acoustic noise from adjacent pneumatic equipment.'
        ],
        futureWork: [
          'Design an FPGA-based root-mean-square and peak-definition preprocessor for edge AE streaming.',
          'Develop adaptive filtering to isolate airborne factory noise from mechanical stress waves.'
        ],
        importantEvidence: [
          '"Subsurface micro-crack acoustic emission bursts were registered 78.2 hours before surface vibration kurtosis transitioned above nominal baseline."',
          '"Uncompressed raw 1 MS/s acquisition yielded 124.6 MB per minute per channel, exceeding standard LTE/5G industrial gateway backhaul limits."'
        ],
        researchRelevance: 'Demonstrates the critical trade-off between ultra-early fault detection horizons and real-world edge hardware constraints.',
        analyzedAt: '2026-03-15T11:20:00.000Z',
        providerUsed: 'grok'
      }
    }
  ],
  evidence: [
    {
      id: 'demo-ev-1',
      projectId: 'demo-machinery-predictive-maintenance',
      sourceId: 'demo-source-1',
      sourceTitle: '[DEMO BENCHMARK] Multi-Sensor Vibration Analysis for Accelerated Bearing Degradation',
      claim: 'Spectral envelope kurtosis provides significantly longer prognostic lead time than ISO standard RMS vibration limits.',
      sourceEvidence: 'Spectral kurtosis peaked at 14.8 at T-42.4 hours before catastrophic cage breakdown, while ISO RMS limits were breached only at T-6.2 hours.',
      location: 'Section 4.3, Paragraph 2 & Figure 7',
      evidenceType: 'Empirical',
      confidence: 'High',
      aiInterpretation: 'Traditional plant condition-based maintenance policies that trigger inspections based on bulk RMS thresholds risk catastrophic stoppage because the warning window (6.2 hours) is inadequate for scheduling maintenance shifts.',
      aiSuggestion: 'Evaluate deploying envelope bandpass filters centered around 3.2 - 5.8 kHz on programmable edge transmitters.',
      userNotes: 'Key justification for why simple threshold alarms in legacy SCADA systems fail in modern high-throughput lines.',
      createdAt: '2026-03-16T08:30:00.000Z'
    },
    {
      id: 'demo-ev-2',
      projectId: 'demo-machinery-predictive-maintenance',
      sourceId: 'demo-source-2',
      sourceTitle: '[DEMO ARCHITECTURE] Temporal Convolutional Networks and Attention Mechanisms',
      claim: 'Dilated TCN with attention achieves sub-5ms edge latency while maintaining superior regression accuracy over recurrent models.',
      sourceEvidence: 'Inference latency measured 4.8 ms per 2048-sample window on NVIDIA Jetson Orin Nano, enabling real-time edge decision loops within 10 ms cycle times.',
      location: 'Table 4, Edge Hardware Benchmark Comparison',
      evidenceType: 'Statistical',
      confidence: 'High',
      aiInterpretation: 'The parallelizable 1D convolutional kernel avoids the sequential hidden state bottleneck of LSTMs, fitting comfortably into tight closed-loop control cycles.',
      aiSuggestion: 'Consider testing whether 8-bit post-training quantization preserves the 0.082 MAE accuracy while reducing power draw below 7W.',
      userNotes: 'Critical empirical proof for low-latency edge deployment feasibility.',
      createdAt: '2026-03-16T09:00:00.000Z'
    },
    {
      id: 'demo-ev-3',
      projectId: 'demo-machinery-predictive-maintenance',
      sourceId: 'demo-source-2',
      sourceTitle: '[DEMO ARCHITECTURE] Temporal Convolutional Networks and Attention Mechanisms',
      claim: 'Deep temporal networks exhibit severe accuracy collapse under unseen operational mechanical loads.',
      sourceEvidence: 'Out-of-distribution load shifts (10 kN to 14 kN) led to an immediate 28.1% degradation in RUL prediction accuracy.',
      location: 'Section 5.2, Cross-Domain Generalization Experiment',
      evidenceType: 'Empirical',
      confidence: 'High',
      aiInterpretation: 'Neural networks without explicit physics-informed loss constraints overfit to the testbed mechanical dynamics and fail when motor operating conditions shift.',
      aiSuggestion: 'Investigate physics-guided neural networks (PINNs) where mechanical torque laws act as regularization terms.',
      userNotes: 'Major research gap to target in dissertation / technical paper.',
      createdAt: '2026-03-16T09:15:00.000Z'
    },
    {
      id: 'demo-ev-4',
      projectId: 'demo-machinery-predictive-maintenance',
      sourceId: 'demo-source-3',
      sourceTitle: '[DEMO COMPARATIVE] Sensor Fusion of Acoustic Emissions and Piezoelectric Accelerometers',
      claim: 'Acoustic emissions detect initial subsurface micro-dislocations prior to surface-manifested vibration changes.',
      sourceEvidence: 'Subsurface micro-crack acoustic emission bursts were registered 78.2 hours before surface vibration kurtosis transitioned above nominal baseline.',
      location: 'Section 3.4, Comparative Fault Onset Timeline',
      evidenceType: 'Empirical',
      confidence: 'High',
      aiInterpretation: 'Stress wave propagation in the 100 kHz - 1 MHz spectrum captures crystal lattice cleavage events that lack sufficient energy to excite structural vibration modes.',
      aiSuggestion: 'Propose a tiered architecture: low-power vibration telemetry continuously active, with high-frequency AE triggered only when early kurtosis anomalies appear.',
      userNotes: 'Potential novel system architecture for industrial commercialization.',
      createdAt: '2026-03-16T09:40:00.000Z'
    }
  ],
  comparisons: [
    {
      id: 'demo-comp-1',
      projectId: 'demo-machinery-predictive-maintenance',
      sourceIds: ['demo-source-1', 'demo-source-2', 'demo-source-3'],
      sourceTitles: [
        '[DEMO BENCHMARK] Multi-Sensor Vibration Analysis (Vance et al., 2025)',
        '[DEMO ARCHITECTURE] TCN & Attention Mechanisms (Lindqvist et al., 2025)',
        '[DEMO COMPARATIVE] Sensor Fusion of AE & Accelerometers (Nakamura et al., 2026)'
      ],
      objectiveComparison: 'Vance et al. focus on establishing statistical threshold horizons for outer-race flaking; Lindqvist et al. focus on algorithm inference optimization and RUL regression accuracy; Nakamura et al. focus on sensor modality limits and acoustic emission early detection.',
      methodologyComparison: 'Vance et al. utilize empirical accelerated life testing with statistical signal processing (envelope kurtosis); Lindqvist et al. apply deep representation learning (dilated 1D-TCN with self-attention); Nakamura et al. implement dual-modality multi-frequency acquisition (1 MS/s AE + 50 kS/s vibration).',
      datasetComparison: 'Vance et al.: 16 tapered roller bearings on custom rig; Lindqvist et al.: IEEE PHM 2012 benchmark + 30 synthetic runs; Nakamura et al.: 8 full runs on 75 kW industrial motor testbed.',
      variablesComparison: 'All three study mechanical loading and rotational speed; Nakamura et al. uniquely add dynamic torque reversals, while Vance et al. monitor thermal housing gradients.',
      algorithmsComparison: 'Statistical bandpass filters and envelope FFT (Vance) vs. Deep 1D-TCN with Attention (Lindqvist) vs. Dual-rate signal decimation and transient peak matching (Nakamura).',
      conditionsComparison: 'Vance: Constant 1800 RPM, 8.5 kN load. Lindqvist: Multi-condition synthetic load (10-14 kN). Nakamura: Dynamic torque reversals (±150 Nm, 0.5 Hz).',
      resultsComparison: 'Vance demonstrates 42.4-hour warning window with spectral kurtosis; Lindqvist achieves 0.082 MAE and 4.8 ms latency on Jetson hardware; Nakamura demonstrates 78.2-hour warning window with AE but highlights a 124 MB/min data bottleneck.',
      limitationsComparison: 'Vance lacks algorithmic generalization; Lindqvist suffers a 28.1% accuracy collapse across out-of-distribution loads; Nakamura faces prohibitive edge transmission bandwidth.',
      futureWorkComparison: 'Common consensus across all three authors highlights the urgent need for domain-invariant algorithms capable of operating under uncalibrated, fluctuating real-world factory loads.',
      areasOfAgreement: [
        'Unanimous agreement that raw RMS vibration alone is inadequate for modern high-reliability prognostics, warning only hours before failure.',
        'Agreement that high sampling rates (>20 kHz for vibration, >500 kHz for AE) are mandatory to capture incipient degradation signatures.',
        'Agreement that temperature shifts introduce uncompensated sensor baseline bias.'
      ],
      areasOfDifference: [
        'Disagreement on diagnostic lead time: Vance identifies 42 hours via vibration kurtosis, whereas Nakamura claims 78 hours via ultrasonic acoustic emissions.',
        'Algorithmic philosophy: Vance argues for transparent, interpretable statistical parameters for industrial certification, whereas Lindqvist demonstrates superior predictive accuracy via black-box deep models.'
      ],
      potentialResearchGaps: [
        'Bridging the 28.1% load generalization collapse identified by Lindqvist using domain adaptation without requiring full 124 MB/min acoustic streaming as reported by Nakamura.',
        'Evaluating how thermal drift (noted by Vance) corrupts neural attention weight distributions in temporal models.'
      ],
      createdAt: '2026-03-17T11:00:00.000Z',
      providerUsed: 'grok'
    }
  ],
  syntheses: [
    {
      id: 'demo-syn-1',
      projectId: 'demo-machinery-predictive-maintenance',
      title: 'Synthesis of Prognostic Horizons and Computational Constraints in Rotating Machinery',
      sourceIds: ['demo-source-1', 'demo-source-2', 'demo-source-3'],
      evidenceSupportedFindings: [
        {
          finding: 'Early fault detection horizons scale proportionally with sensor frequency range: acoustic emission (100-900 kHz) provides ~78 hours lead time, envelope kurtosis (3-6 kHz) provides ~42 hours, whereas standard ISO RMS provides only ~6 hours before breakdown.',
          supportingSourceIds: ['demo-source-1', 'demo-source-3'],
          sourceCitations: 'Vance et al. (2025); Nakamura et al. (2026)'
        },
        {
          finding: 'Modern temporal deep architectures (dilated TCN with attention) achieve edge inference latencies under 5 ms on low-power hardware, making real-time prognostics feasible on modern industrial gateway controllers.',
          supportingSourceIds: ['demo-source-2'],
          sourceCitations: 'Lindqvist et al. (2025)'
        },
        {
          finding: 'Current deep prognostic models suffer severe performance degradation (approx. 28% error increase) when tested under mechanical loads not present in the training distribution.',
          supportingSourceIds: ['demo-source-2'],
          sourceCitations: 'Lindqvist et al. (2025)'
        }
      ],
      interpretation: 'The literature reveals a sharp trade-off between physical diagnostic anticipation and computational deployability. While ultrasonic acoustic emissions detect micro-cracks days before physical vibration emerges, transmitting and processing 124 MB/min per channel is impractical for distributed factories. Conversely, deep models executing on standard vibration data offer edge compatibility but lack cross-domain mechanical generalizability.',
      unresolvedQuestions: [
        'Can physics-informed regularizers prevent the 28% generalization drop without requiring large multi-condition training corpora?',
        'What is the minimum edge-processed acoustic emission feature vector necessary to preserve the 78-hour prognostic advantage while adhering to sub-10 kB/s telemetry envelopes?'
      ],
      conflictingEvidence: [
        {
          topic: 'Optimal Diagnostic Metric for Incipient Outer Race Damage',
          sourceA: 'Vance et al. (2025)',
          stanceA: 'Argues spectral envelope kurtosis on standard accelerometers is sufficient and cost-effective, providing 42 hours advance notice.',
          sourceB: 'Nakamura et al. (2026)',
          stanceB: 'Argues vibration kurtosis is already late-stage surface damage, demonstrating acoustic emissions register subsurface stress 36 hours prior to kurtosis rise.'
        }
      ],
      potentialResearchDirections: [
        'Hybrid edge architectures featuring event-driven sensor awakening (accelerometer triggers burst acoustic emission sampling).',
        'Contrastive domain-invariant self-supervised learning for rotating machinery under variable factory speeds.'
      ],
      createdAt: '2026-03-18T10:00:00.000Z',
      providerUsed: 'grok'
    }
  ],
  gaps: [
    {
      id: 'demo-gap-1',
      projectId: 'demo-machinery-predictive-maintenance',
      category: 'limited_operating_conditions',
      categoryLabel: 'Limited Operating Conditions',
      title: 'Generalization Collapse Under Unseen Mechanical Load Distributions',
      description: 'Existing deep learning RUL architectures exhibit an immediate 28% degradation in predictive accuracy when encountering operational loads outside their training distribution.',
      supportingEvidence: 'Lindqvist et al. (2025) measured a 28.1% MAE increase when transitioning testbed load from 10 kN to 14 kN without fine-tuning.',
      impactAssessment: 'High: Real-world industrial rotating equipment experiences dynamic, non-stationary duty cycles. Models trained on static bench tests cannot be reliably certified for autonomous plant safety.',
      suggestedInvestigation: 'Incorporate physics-guided neural networks (PINNs) where mechanical fatigue laws constrain network gradients across variable load domains.',
      createdAt: '2026-03-18T14:00:00.000Z'
    },
    {
      id: 'demo-gap-2',
      projectId: 'demo-machinery-predictive-maintenance',
      category: 'lack_of_industrial_validation',
      categoryLabel: 'Lack of Industrial Validation & Edge Bandwidth Bottlenecks',
      title: 'High-Frequency Acoustic Emission Bandwidth Exceeds Factory Telemetry Budgets',
      description: 'Although ultrasonic acoustic emissions offer a 78-hour early warning window, the raw ingestion throughput (>120 MB/min per channel) is unviable for edge transmission over industrial wireless/Ethernet protocols.',
      supportingEvidence: 'Nakamura et al. (2026) reported 124.6 MB/min data generation rate per bearing channel on 1 MS/s acquisition.',
      impactAssessment: 'High: Prevents adoption of the most sensitive prognostic modality in large manufacturing facilities with hundreds of monitored motor assets.',
      suggestedInvestigation: 'Design an on-sensor FPGA or ultra-low-power DSP pipeline that extracts burst parameters (ringdown counts, duration, peak amplitude) at the transducer head, reducing data rates by 99.5%.',
      createdAt: '2026-03-18T14:15:00.000Z'
    },
    {
      id: 'demo-gap-3',
      projectId: 'demo-machinery-predictive-maintenance',
      category: 'missing_variables',
      categoryLabel: 'Missing Variables & Sensor Bias',
      title: 'Thermal Drift and Sensor Coupling Bias Omitted in Prognostic Modeling',
      description: 'Piezoelectric and acoustic transducers suffer significant gain drift when bearing housings heat up during prolonged operation, yet deep learning models treat raw sensor amplitudes as stationary.',
      supportingEvidence: 'Vance et al. (2025) observed an 8.4% amplitude bias when bearing housings reached 74 °C.',
      impactAssessment: 'Medium: Thermal false alarms or premature RUL estimates can trigger unnecessary machine shutdowns in continuous process industries.',
      suggestedInvestigation: 'Implement coupled thermal-vibrational calibration layers that actively normalize vibration amplitudes against local RTD thermocouple telemetry.',
      createdAt: '2026-03-18T14:30:00.000Z'
    }
  ],
  notes: [
    {
      id: 'demo-note-1',
      projectId: 'demo-machinery-predictive-maintenance',
      type: 'Finding',
      title: 'Envelope Kurtosis vs Bulk RMS Threshold Warning Windows',
      content: 'Vance et al. (2025) proves that relying on standard ISO 10816 RMS thresholds yields only a ~6 hour maintenance window. Spectral kurtosis in the 3.2-5.8 kHz band gives 42.4 hours. Must emphasize this comparison in our literature review.',
      tags: ['Vibration', 'Kurtosis', 'ISO 10816', 'Prognostics'],
      sourceId: 'demo-source-1',
      sourceTitle: '[DEMO BENCHMARK] Multi-Sensor Vibration Analysis',
      createdAt: '2026-03-16T15:00:00.000Z',
      updatedAt: '2026-03-16T15:00:00.000Z'
    },
    {
      id: 'demo-note-2',
      projectId: 'demo-machinery-predictive-maintenance',
      type: 'Hypothesis',
      title: 'Physics-Informed Regularizer for Cross-Load Invariance',
      content: 'If we incorporate Paris-Erdogan crack propagation equations as an auxiliary penalty term in the dilated TCN loss function, can we constrain the latent space to adhere to monotonic wear curves regardless of load changes?',
      tags: ['PINN', 'Fatigue Physics', 'Domain Adaptation'],
      createdAt: '2026-03-17T16:20:00.000Z',
      updatedAt: '2026-03-17T16:20:00.000Z'
    },
    {
      id: 'demo-note-3',
      projectId: 'demo-machinery-predictive-maintenance',
      type: 'Idea',
      title: 'Two-Tier Edge Sensor Wakeup Architecture',
      content: 'Run a 3-axis accelerometer continuously on low power. When spectral kurtosis breaches 3.5, wake up the high-frequency 1 MHz acoustic emission sensor for a 5-second burst to confirm subsurface micro-cracks. Reduces total bandwidth by ~98%.',
      tags: ['Hardware Architecture', 'Sensor Wakeup', 'Edge Compute'],
      sourceId: 'demo-source-3',
      sourceTitle: '[DEMO COMPARATIVE] Sensor Fusion of AE and Accelerometers',
      createdAt: '2026-03-18T09:30:00.000Z',
      updatedAt: '2026-03-18T09:30:00.000Z'
    }
  ],
  reports: [
    {
      id: 'demo-report-1',
      projectId: 'demo-machinery-predictive-maintenance',
      title: 'Comparative Evaluation of Signal-Processed and Deep Learning Prognostics for Rotating Machinery',
      citationStyle: 'IEEE',
      sections: {
        title: 'Comparative Evaluation of Signal-Processed and Deep Learning Prognostics for Rotating Machinery',
        abstract: 'Accurate Remaining Useful Life (RUL) estimation in induction motor rotating bearings is essential for preventing catastrophic industrial downtime. This report synthesizes recent empirical benchmark datasets, modern dilated temporal convolutional architectures, and high-frequency acoustic emission sensor fusion pipelines. We demonstrate that while envelope kurtosis provides a 42.4-hour diagnostic lead time over ISO RMS limits and dilated TCNs deliver sub-5ms edge inference, deep models suffer an acute 28.1% accuracy collapse when tested on unseen mechanical loads. We propose a physics-guided, two-tier sensor activation framework to address this gap.',
        introduction: 'Electromechanical drive systems form the backbone of modern industrial automation, with bearing and gear degradation accounting for over 50% of unplanned motor breakdowns. Traditional condition monitoring has long depended on root-mean-square (RMS) vibrational velocity thresholds established by standards such as ISO 10816. However, modern high-speed operations demand predictive horizons measured in days rather than hours.',
        background: 'Localized fatigue spalls generate periodic high-frequency impacts when rolling elements traverse damaged raceways. These manifest at characteristic kinematic frequencies including Ball Pass Frequency Outer-Race (BPFO) and Ball Pass Frequency Inner-Race (BPFI). Concurrently, subsurface micro-crack nucleation releases high-frequency elastic stress waves (100 kHz - 1 MHz) detectable as Acoustic Emissions (AE).',
        literatureReview: 'Vance et al. [1] quantified the temporal lead time of spectral envelope kurtosis against broadband RMS amplitude across 16 run-to-failure bearing trials, demonstrating that kurtosis elevation preceded structural seizure by 42.4 ± 3.1 hours. Lindqvist and Kowalski [2] introduced a dilated 1D-TCN with self-attention, reducing RUL Mean Absolute Error to 0.082 on public benchmarks while achieving a 4.8 ms execution latency on embedded edge hardware. Concurrently, Nakamura et al. [3] proved that ultrasonic acoustic emission bursts manifest 78.2 hours before surface vibration metrics deviate from baseline, though at the expense of a 124.6 MB/min data generation bottleneck.',
        methodology: 'A comparative synthesis was conducted across three verified experimental investigations spanning 24 run-to-failure empirical tests, accelerated fatigue rigs (8.5 kN - 14 kN), and variable torque industrial induction motors. Evaluation criteria encompassed prognostic lead time, computational inference latency, cross-load generalizability, and sensor bandwidth feasibility.',
        findings: 'The collected evidence demonstrates: 1) Diagnostic horizons expand from 6.2 hours (ISO RMS) to 42.4 hours (envelope kurtosis) and 78.2 hours (acoustic emissions). 2) Dilated 1D-TCN models satisfy hard real-time latency budgets (4.8 ms on Jetson Orin Nano). 3) Deep models exhibit a 28.1% error increase when operating conditions deviate from training distributions.',
        discussion: 'The primary bottleneck in deploying autonomous industrial prognostics is not algorithmic latency, but rather model brittleness under non-stationary mechanical duty cycles and the prohibitive telemetry bandwidth of ultrasonic transducers. A pure black-box deep learning model trained on constant bench loads cannot guarantee safe operational bounds in factory environments.',
        potentialResearchGaps: 'Identified gaps include: 1) Generalization collapse under out-of-distribution mechanical loads (Lindqvist et al. [2]). 2) Telemetry backhaul constraints for high-speed acoustic emission streaming (Nakamura et al. [3]). 3) Uncompensated piezoelectric amplitude drift caused by bearing housing thermal gradients up to 74 °C (Vance et al. [1]).',
        futureWork: 'Future research must formulate physics-guided neural networks incorporating mechanical wear laws, develop FPGA edge extractors for acoustic bursts, and validate multi-sensor architectures under dynamic speed and torque cycles.',
        conclusion: 'By transitioning from static threshold monitoring to multi-frequency feature fusion and domain-regularized temporal networks, industrial condition monitoring can achieve multi-day predictive horizons while respecting edge hardware constraints.',
        references: [
          '[1] H. Vance, R. Chen, and T. Al-Mansoor, "Multi-Sensor Vibration Analysis for Accelerated Bearing Degradation in Induction Drives," J. Prognostics Health Manage., vol. 18, no. 4, pp. 214-228, Aug. 2025, doi: 10.1016/j.demo.phm.2025.109214.',
          '[2] E. Lindqvist and M. Kowalski, "Temporal Convolutional Networks and Attention Mechanisms for Remaining Useful Life Estimation," in Proc. IEEE Int. Conf. Mach. Learn. Prognostics, Nov. 2025, pp. 88-96, doi: 10.1109/DEMO.PHMCONF.2025.882190.',
          '[3] S. Nakamura, B. O\'Connor, and D. Weber, "Sensor Fusion of Acoustic Emissions and Piezoelectric Accelerometers in Industrial Motors," Sensors, vol. 26, no. 2, p. 412, Jan. 2026, doi: 10.3390/demo-sensors-2026-00412.'
        ]
      },
      generatedAt: '2026-03-19T16:00:00.000Z',
      providerUsed: 'Grok / xAI',
      modelUsed: 'grok-4.6'
    }
  ],
  webResults: [
    {
      id: 'demo-web-1',
      projectId: 'demo-machinery-predictive-maintenance',
      query: 'Bearing fault vibration frequency formulas BPFO BPFI BSF FTF',
      title: 'Kinematic Bearing Defect Frequency Equations - Technical Reference',
      url: 'https://example.org/demo-archive/kinematic-bearing-frequencies',
      source: 'Mechanical Vibration Standards Consortium',
      retrievalTimestamp: '2026-03-16T11:00:00.000Z',
      excerpt: 'BPFO = (n/2) * (1 - (d/D)*cos(alpha)) * f_r. Characteristic outer race defect harmonic is determined by roller diameter (d), pitch diameter (D), contact angle (alpha), and shaft speed (f_r).'
    }
  ],
  chatHistory: [
    {
      id: 'demo-chat-1',
      role: 'user',
      content: 'What evidence is there comparing the warning lead time of envelope kurtosis versus standard ISO vibration limits?',
      scope: 'project',
      timestamp: '2026-03-17T14:00:00.000Z'
    },
    {
      id: 'demo-chat-2',
      role: 'assistant',
      content: 'Spectral envelope kurtosis provides an average warning horizon of 42.4 ± 3.1 hours prior to bearing seizure, whereas standard ISO 10816 broadband RMS limits are only breached 6.2 hours before failure.',
      structuredAnswer: {
        answer: 'Envelope kurtosis offers an approximately 7x longer predictive maintenance window (42.4 hours) compared to standard ISO broadband RMS velocity limits (6.2 hours).',
        evidence: [
          '"Spectral kurtosis peaked at 14.8 at T-42.4 hours before catastrophic cage breakdown, while ISO RMS limits were breached only at T-6.2 hours." (Vance et al., 2025, Section 4.3)'
        ],
        sources: [
          '[DEMO BENCHMARK] Multi-Sensor Vibration Analysis for Accelerated Bearing Degradation in Induction Drives (Vance et al., 2025)'
        ],
        interpretation: 'Standard plant condition monitoring relying on raw RMS thresholds provides inadequate time to schedule parts and technician shifts. Envelope kurtosis in the 3.2 - 5.8 kHz band isolates transient impacts before bulk mechanical energy escalates.',
        uncertainty: 'These findings were gathered on 16 tapered roller bearings under constant 1800 RPM and 8.5 kN load; transient speed operations were not evaluated in this benchmark.'
      },
      scope: 'project',
      timestamp: '2026-03-17T14:00:05.000Z',
      providerUsed: 'Grok',
      modelUsed: 'grok-4.6'
    }
  ]
};
